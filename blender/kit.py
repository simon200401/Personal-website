"""建模小工具：材质登记（beauty/albedo/emit 三套出口）、基本体、贴 DOM 用的四边形登记、灯光。"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Euler, Matrix, Vector

ROOT = os.path.dirname(os.path.abspath(__file__))
T = 0.75          # 桌面高度
WALL_Y = 0.74     # 后墙内表面
ZMAX = 9.0        # depth 通道的归一化距离
LIGHT_GROUPS = ("sun", "sky", "screen", "rgb", "lamp")
rng = random.Random(42)


# ───────────────────────── 基础工具 ─────────────────────────
def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def rgb(hexstr):
    h = hexstr.lstrip("#")
    return tuple(lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


MATS = {}


def M(name, hexcol="#888888", rough=0.6, emit=0.0, image=None, metal=0.0):
    """登记一个材质；每个材质带三套出口：beauty / albedo（纯色自发光）/ emit（只留发光体）。"""
    if name in MATS:
        return MATS[name]["mat"]
    mat = bpy.data.materials.new(name)
    try:
        mat.use_nodes = True
    except Exception:
        pass
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    col = rgb(hexcol)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = col
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Emission Color"].default_value = col
    bsdf.inputs["Emission Strength"].default_value = emit
    alb = nt.nodes.new("ShaderNodeEmission")
    alb.inputs["Color"].default_value = col
    emi = nt.nodes.new("ShaderNodeEmission")
    emi.inputs["Color"].default_value = col if emit > 0 else (0, 0, 0, 1)
    if image:
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(os.path.join(ROOT, "tex", image))
        targets = [(bsdf, "Base Color"), (bsdf, "Emission Color"), (alb, "Color")] + ([(emi, "Color")] if emit > 0 else [])
        for node, sock in targets:
            nt.links.new(tex.outputs["Color"], node.inputs[sock])
    mat.diffuse_color = col
    MATS[name] = {"mat": mat, "out": out, "beauty": bsdf, "albedo": alb, "emit": emi}
    return mat


def set_mode(mode):
    for m in MATS.values():
        nt = m["mat"].node_tree
        for l in list(m["out"].inputs["Surface"].links):
            nt.links.remove(l)
        nt.links.new(m[mode].outputs[0], m["out"].inputs["Surface"])


def adopt(mat, paint=None, metal=None, rough=None, sat=None, val=1.0):
    """把外部导入的材质（glTF 的 Principled）接进 MATS：原样留作 beauty，再补 albedo / emit 两个出口。
    paint 给了就把底色换成这个颜色（车漆）；sat / val 给贴图调饱和度和亮度（棕虎斑 → 银虎斑）。"""
    if mat.name in MATS:
        return mat
    nt = mat.node_tree
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    p = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    beauty = out.inputs["Surface"].links[0].from_node if out.inputs["Surface"].links else p
    alb, emi = nt.nodes.new("ShaderNodeEmission"), nt.nodes.new("ShaderNodeEmission")
    emi.inputs["Color"].default_value = (0, 0, 0, 1)
    if p:
        bc = p.inputs["Base Color"]
        if paint:
            for l in list(bc.links):
                nt.links.remove(l)
            bc.default_value = rgb(paint)
        if metal is not None:
            p.inputs["Metallic"].default_value = metal
        if rough is not None:
            p.inputs["Roughness"].default_value = rough
        if bc.links and sat is not None:
            hs = nt.nodes.new("ShaderNodeHueSaturation")
            hs.inputs["Saturation"].default_value, hs.inputs["Value"].default_value = sat, val
            nt.links.new(bc.links[0].from_socket, hs.inputs["Color"])
            nt.links.new(hs.outputs["Color"], bc)
        if bc.links:
            nt.links.new(bc.links[0].from_socket, alb.inputs["Color"])
        else:
            alb.inputs["Color"].default_value = bc.default_value
        mat.diffuse_color = bc.default_value
        if p.inputs["Emission Strength"].default_value > 0:
            ec = p.inputs["Emission Color"]
            if ec.links:
                nt.links.new(ec.links[0].from_socket, emi.inputs["Color"])
            else:
                emi.inputs["Color"].default_value = ec.default_value
    else:   # 无光照材质（KHR_materials_unlit）：albedo 直接接贴图
        im = next((n for n in nt.nodes if n.type == "TEX_IMAGE"), None)
        if im:
            nt.links.new(im.outputs["Color"], alb.inputs["Color"])
    MATS[mat.name] = {"mat": mat, "out": out, "beauty": beauty, "albedo": alb, "emit": emi}
    return mat


def glb(name, path, length, loc, rot=(0, 0, 0), pre=(0, 0, 0), hot=None, parent=None, paint=None, sat=None, val=1.0):
    """导入一个 glb 模型：所有零件合成一个网格（墨线只描外轮廓，不会把小零件描成一团），
    去掉动画；先按 pre（欧拉角，弧度）转一下（比如把立着的面具放倒），再按水平最长边缩放到 length，底面贴 z=0。
    paint = {材质名里的关键词: 颜色}，用来换车漆之类；sat / val 调整个模型贴图的饱和度和亮度。"""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, path))
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    for o in new:
        o.animation_data_clear()
        if o.type == "MESH" and o.data.shape_keys:
            o.shape_key_clear()
    for o in meshes:
        mw = o.matrix_world.copy()
        o.data = o.data.copy()
        o.data.transform(mw)
        o.parent = None
        o.matrix_world = Matrix.Identity(4)
        o.modifiers.clear()
    for o in new:
        if o.type != "MESH":
            bpy.data.objects.remove(o)
    ob = meshes[0]
    if len(meshes) > 1:
        with bpy.context.temp_override(active_object=ob, selected_editable_objects=meshes, selected_objects=meshes):
            bpy.ops.object.join()
    ob.name = ob.data.name = name
    me = ob.data
    # 有的模型自带卡通描边（反向外壳，材质叫 outline），会把整个物体包成黑块；描边交给风格化那一步
    drop = {i for i, m in enumerate(me.materials) if m and "outline" in m.name.lower()}
    if drop:
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index in drop], context="FACES")
        bm.to_mesh(me)
        bm.free()
    me.transform(Euler(pre).to_matrix().to_4x4())
    vs = [v.co for v in me.vertices]
    mn = Vector([min(v[i] for v in vs) for i in range(3)])
    mx = Vector([max(v[i] for v in vs) for i in range(3)])
    k = length / max(mx.x - mn.x, mx.y - mn.y)
    me.transform(Matrix.Scale(k, 4) @ Matrix.Translation((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z)))
    for slot in ob.material_slots:
        if slot.material:
            col = next((c for key, c in (paint or {}).items() if key in slot.material.name), None)
            adopt(slot.material, paint=col, metal=0.7 if col else None, rough=0.28 if col else None, sat=sat, val=val)
    ob.rotation_mode = "XYZ"   # glTF 导进来是四元数，不改的话下面的 rotation_euler 不生效
    ob.location, ob.rotation_euler = loc, Euler(rot)
    if hot:
        ob["hot"] = hot
    if parent:
        ob.parent = parent
    return ob


def add(name, bm, mat=None, loc=(0, 0, 0), rot=(0, 0, 0), hot=None, parent=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler = loc, Euler(rot)
    if mat:
        me.materials.append(mat)
    if hot:
        ob["hot"] = hot
    if parent:
        ob.parent = parent
    return ob


def box(name, size, loc, mat, rot=(0, 0, 0), hot=None, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    return add(name, bm, mat, loc, rot, hot, parent)


def cyl(name, r, h, loc, mat, rot=(0, 0, 0), r2=None, seg=40, hot=None, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    for f in bm.faces:
        f.smooth = abs(f.normal.z) < 0.9
    return add(name, bm, mat, loc, rot, hot, parent)


def ball(name, r, loc, mat, scale=(1, 1, 1), rot=(0, 0, 0), hot=None, parent=None, half=False):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=18, radius=r)
    if half:
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0), plane_no=(0, 0, -1), clear_outer=True)
        bmesh.ops.holes_fill(bm, edges=bm.edges)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    for f in bm.faces:
        f.smooth = len(f.verts) <= 4
    return add(name, bm, mat, loc, rot, hot, parent)


def torus(name, R, r, loc, mat, rot=(0, 0, 0), hot=None, parent=None, arc=math.tau, seg=40, sub=12):
    bm = bmesh.new()
    closed = abs(arc - math.tau) < 1e-6
    n = seg if closed else seg + 1
    rings = []
    for i in range(n):
        a = arc * i / seg
        c = Vector((math.cos(a) * R, math.sin(a) * R, 0))
        rings.append([bm.verts.new(c + Vector((math.cos(a) * math.cos(b), math.sin(a) * math.cos(b), math.sin(b))) * r)
                      for b in (math.tau * j / sub for j in range(sub))])
    for i in range(seg if not closed else n):
        a, b = rings[i], rings[(i + 1) % n]
        for j in range(sub):
            bm.faces.new((a[j], b[j], b[(j + 1) % sub], a[(j + 1) % sub])).smooth = True
    return add(name, bm, mat, loc, rot, hot, parent)


def slab(name, w, d, h, radius, loc, mat, rot=(0, 0, 0), hot=None, front_bulge=0.0):
    """圆角板（俯视轮廓带圆角，可选前沿外凸），用作桌面、鼠标垫、地毯。"""
    pts = []
    for cx, cy, a0 in ((w / 2 - radius, d / 2 - radius, 0), (-w / 2 + radius, d / 2 - radius, 90),
                       (-w / 2 + radius, -d / 2 + radius, 180), (w / 2 - radius, -d / 2 + radius, 270)):
        for k in range(9):
            a = math.radians(a0 + 90 * k / 8)
            pts.append((cx + math.cos(a) * radius, cy + math.sin(a) * radius))
    if front_bulge:
        pts = [(x, y - front_bulge * max(0.0, 1 - (2 * x / w) ** 2) if y < 0 else y) for x, y in pts]
    bm = bmesh.new()
    top = [bm.verts.new((x, y, h / 2)) for x, y in pts]
    bot = [bm.verts.new((x, y, -h / 2)) for x, y in pts]
    bm.faces.new(top)
    bm.faces.new(bot[::-1])
    n = len(pts)
    for i in range(n):
        bm.faces.new((top[i], bot[i], bot[(i + 1) % n], top[(i + 1) % n])).smooth = True
    return add(name, bm, mat, loc, rot, hot)


SURFACES = {}


def plane(name, w, h, loc, mat, rot=(0, 0, 0), hot=None, surface=None, parent=None):
    """竖直朝 -Y 的矩形；surface 给了名字就登记四角（TL,TR,BR,BL），前端把 DOM 贴上去。"""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    co = [(-w / 2, 0, h / 2), (-w / 2, 0, -h / 2), (w / 2, 0, -h / 2), (w / 2, 0, h / 2)]
    f = bm.faces.new([bm.verts.new(c) for c in co])
    for l, t in zip(f.loops, ((0, 1), (0, 0), (1, 0), (1, 1))):
        l[uv].uv = t
    ob = add(name, bm, mat, loc, rot, hot, parent)
    if surface:
        SURFACES[surface] = (ob, [Vector(co[0]), Vector(co[3]), Vector(co[2]), Vector(co[1])])
    return ob


def curved_panel(name, w, h, R, loc, mat, rot=(0, 0, 0), hot=None, surface=None, thick=0.0, seg=28):
    """曲面屏：弧长 w，两侧朝观看者（-Y）弯。"""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    ang = (w / 2) / R
    cols = []
    for i in range(seg + 1):
        a = -ang + 2 * ang * i / seg
        x, y = R * math.sin(a), -(R - R * math.cos(a))
        cols.append((bm.verts.new((x, y, h / 2)), bm.verts.new((x, y, -h / 2))))
    for i in range(seg):
        f = bm.faces.new((cols[i][0], cols[i][1], cols[i + 1][1], cols[i + 1][0]))
        f.smooth = True
        for l, t in zip(f.loops, ((i / seg, 1), (i / seg, 0), ((i + 1) / seg, 0), ((i + 1) / seg, 1))):
            l[uv].uv = t
    ob = add(name, bm, mat, loc, rot, hot)
    if thick:
        mod = ob.modifiers.new("solid", "SOLIDIFY")
        mod.thickness, mod.offset = thick, -1
    if surface:
        xe, ye = R * math.sin(ang), -(R - R * math.cos(ang))
        SURFACES[surface] = (ob, [Vector((-xe, ye, h / 2)), Vector((xe, ye, h / 2)), Vector((xe, ye, -h / 2)), Vector((-xe, ye, -h / 2))])
    return ob


def light(name, kind, group, energy, color, loc=(0, 0, 0), rot=(0, 0, 0), size=0.2, size_y=None, angle=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy, ld.color = energy, rgb(color)[:3]
    if kind == "AREA":
        ld.shape = "RECTANGLE" if size_y else "SQUARE"
        ld.size = size
        if size_y:
            ld.size_y = size_y
    if kind == "SUN" and angle:
        ld.angle = math.radians(angle)
    if kind == "POINT":
        ld.shadow_soft_size = size
    ob = bpy.data.objects.new(name, ld)
    bpy.context.scene.collection.objects.link(ob)
    ob.location, ob.rotation_euler = loc, Euler(rot)
    ob["group"] = group
    return ob


