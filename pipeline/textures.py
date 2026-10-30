# /// script
# dependencies = ["numpy", "pillow", "opencv-python-headless", "global-land-mask"]
# ///
"""场景里所有“印刷品”的贴图：软木板、剪报、海报、项目刊物、笔记本、屏幕、台历、电影票、卡片盒标签、砖墙、木纹、楼体。

用法：uv run pipeline/textures.py blender/tex
桌上和墙上的字都在这里；标了 TODO 的是占位。改完重跑 Blender。
"""
import json
import math
import random
import re
import sys
from datetime import date
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from make_wallpaper import render as wallpaper

# 拉丁字体随仓库带着（pipeline/fonts/，SIL OFL 1.1），换台机器也一样；中文字体用系统里找得到的第一个
FONT_DIR = Path(__file__).resolve().parent / "fonts"
FONTS = {
    "impact": FONT_DIR / "Anton-Regular.ttf", "black": FONT_DIR / "ArchivoBlack-Regular.ttf", "hand": FONT_DIR / "CaveatBrush-Regular.ttf",
    "marker": FONT_DIR / "PermanentMarker-Regular.ttf", "mono": FONT_DIR / "CourierPrime-Bold.ttf", "serif": FONT_DIR / "PTSerif-Bold.ttf",
    "din": FONT_DIR / "Oswald-SemiBold.ttf", "slab": FONT_DIR / "RobotoSlab-Bold.ttf", "body": FONT_DIR / "PTSerif-Regular.ttf",
}
CJK_FONTS = (
    "/System/Library/Fonts/Hiragino Sans GB.ttc", "/System/Library/Fonts/PingFang.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc", "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc", "C:/Windows/Fonts/msyh.ttc",
)
INK, PAPER, NEWS = (24, 24, 28), (255, 250, 240), (238, 232, 216)
RED, BLUE, YELLOW, GREEN, PINK, ORANGE = (229, 72, 77), (43, 107, 228), (255, 214, 64), (48, 164, 108), (255, 170, 196), (255, 122, 61)


@lru_cache(maxsize=None)
def font(name, size):
    if name == "cjk":
        path = next((f for f in CJK_FONTS if Path(f).exists()), None)
        if path is None:
            raise FileNotFoundError("找不到中文字体，把一个 .ttc/.ttf 的路径加进 CJK_FONTS")
        return ImageFont.truetype(path, size)
    return ImageFont.truetype(str(FONTS[name]), size)


def fit(draw, text, name, box_w, size):
    """从 size 往下缩，直到一行放得进 box_w。"""
    while size > 8 and draw.textlength(text, font=font(name, size)) > box_w:
        size -= 2
    return font(name, size)


def paper(w, h, color, grain=7, seed=0):
    rs = np.random.RandomState(seed)
    a = np.clip(np.array(color, np.float32)[None, None] + rs.normal(0, grain, (h, w, 1)), 0, 255)
    return Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def wrap(d, text, fnt, width):
    """按宽度折行：英文按词，中文按字。"""
    lines, line = [], ""
    for token in re.findall(r"[A-Za-z0-9'’\-.,:;!?%$¥()\"/×·+&]+|\s+|.", text):
        token = " " if token.isspace() else token
        if d.textlength(line + token, font=fnt) > width and line.strip():
            lines.append(line.rstrip())
            line = token.lstrip()
        else:
            line += token
    if line.strip():
        lines.append(line.rstrip())
    return lines


def body(d, box, text, name="body", size=25, fill=(44, 42, 40), gap=1.24, max_lines=99):
    """在框里排一段真实正文；放不下的行直接不画（不拿灰条充数）。返回排完后的 y。"""
    x0, y0, x1, y1 = box
    fnt, y = font(name, size), y0
    for ln in wrap(d, text, fnt, x1 - x0)[:max_lines]:
        if y + size > y1:
            break
        d.text((x0, y), ln, font=fnt, fill=fill)
        y += size * gap
    return y


def dots(gray, tint, bg):
    """灰度数组（0..1，1 = 亮）→ 报纸网点图。"""
    h, w = gray.shape
    cell = max(5, w // 46)
    yy, xx = np.mgrid[0:h, 0:w]
    u, v = (xx * 0.707 + yy * 0.707) / cell, (-xx * 0.707 + yy * 0.707) / cell
    dist = np.hypot(u - np.floor(u) - 0.5, v - np.floor(v) - 0.5)
    mask = (dist < np.sqrt(np.clip(1 - gray, 0, 1)) * 0.62)[..., None]
    return Image.fromarray(np.where(mask, np.array(tint, np.uint8), np.array(bg, np.uint8)).astype(np.uint8))


def halftone(w, h, seed, tint=INK, bg=NEWS, kind="city", image=None):
    """“新闻照片”。给了 image 就用真图打网点；否则按 kind 画一个图标式的构图。"""
    if image is not None:
        src = ImageOps.autocontrast(ImageOps.fit(image.convert("L"), (w, h), Image.LANCZOS, centering=(0.5, 0.4)), cutoff=2)
        return dots(np.asarray(src, np.float32) / 255, tint, bg)
    rng = random.Random(seed)
    g = Image.new("L", (w, h), 200)
    d = ImageDraw.Draw(g)
    for y in range(h):
        d.line((0, y, w, y), fill=int(235 - 120 * y / h))
    if kind == "city":
        x = 0
        while x < w:
            bw, bh = rng.randint(w // 12, w // 6), rng.randint(h // 4, int(h * 0.85))
            d.rectangle((x, h - bh, x + bw, h), fill=rng.randint(20, 90))
            x += bw + rng.randint(0, 6)
    elif kind == "bars":
        d.ellipse((w * 0.2, h * 0.08, w * 0.8, h * 0.92), fill=25)
        for i, k in enumerate((0.4, 0.72, 0.5)):
            cx = w * (0.38 + 0.12 * i)
            d.rounded_rectangle((cx - w * 0.035, h * (0.5 - k / 2.4), cx + w * 0.035, h * (0.5 + k / 2.4)), radius=w * 0.035, fill=245)
    elif kind == "cup":
        d.polygon([(w * 0.3, h * 0.15), (w * 0.7, h * 0.15), (w * 0.6, h * 0.55), (w * 0.4, h * 0.55)], fill=40)
        d.rectangle((w * 0.47, h * 0.55, w * 0.53, h * 0.75), fill=40)
        d.rectangle((w * 0.36, h * 0.75, w * 0.64, h * 0.86), fill=30)
    elif kind == "podium":
        for i, (x0, top, label) in enumerate(((0.16, 0.50, "2"), (0.39, 0.30, "1"), (0.62, 0.62, "3"))):
            d.rectangle((w * x0, h * top, w * (x0 + 0.22), h), fill=(60, 30, 85)[i])
            d.text((w * (x0 + 0.11), h * (top + 0.16)), label, font=font("black", int(h * 0.2)), fill=240, anchor="mm")
    elif kind == "person":
        d.ellipse((w * 0.36, h * 0.14, w * 0.64, h * 0.52), fill=40)
        d.ellipse((w * 0.12, h * 0.56, w * 0.88, h * 1.5), fill=30)
    return dots(np.asarray(g.filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255, tint, bg)


def stick(dst, src, center, angle=0.0, shadow=10):
    """把一张纸贴到底图上：旋转 + 投影。"""
    src = src.convert("RGBA").rotate(angle, expand=True, resample=Image.BICUBIC)
    x, y = int(center[0] - src.width / 2), int(center[1] - src.height / 2)
    if shadow:
        sh = Image.new("RGBA", src.size, (0, 0, 0, 0))
        sh.putalpha(src.getchannel("A").point(lambda a: a * 0.35))
        dst.paste(sh.filter(ImageFilter.GaussianBlur(shadow * 0.6)), (x + shadow // 2, y + shadow), sh.filter(ImageFilter.GaussianBlur(shadow * 0.6)))
    dst.paste(src, (x, y), src)


def pin(d, x, y, col, r=13):
    d.ellipse((x - r + 3, y - r + 5, x + r + 3, y + r + 5), fill=(0, 0, 0, 70))
    d.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=INK, width=2)
    d.ellipse((x - r * 0.45, y - r * 0.55, x - r * 0.05, y - r * 0.15), fill=(255, 255, 255, 210))


def card(w, h, color=PAPER, border=0, seed=0):
    im = paper(w, h, color, seed=seed)
    if border:
        ImageDraw.Draw(im).rectangle((border, border, w - border - 1, h - border - 1), outline=INK, width=3)
    return im


ASSETS = Path(__file__).resolve().parent.parent / "site/assets"


def avatar():
    """头像：放一张照片在 site/assets/avatar.jpg；没有就返回 None，海报上退回剪影。"""
    f = ASSETS / "avatar.jpg"
    return Image.open(f) if f.exists() else None


def photo(pid):
    """site/assets/photos/<pid>.webp；还没有就返回 None，退回网点假照片。"""
    f = ASSETS / "photos" / f"{pid}.webp"
    return Image.open(f).convert("RGB") if f.exists() else None


def polaroid(kind, caption, seed, size=300, pid=None):
    im = card(size, int(size * 1.2), (252, 250, 246), seed=seed)
    real = photo(pid) if pid else None
    if real:
        side = min(real.size)
        box = ((real.width - side) // 2, (real.height - side) // 2, (real.width + side) // 2, (real.height + side) // 2)
        ph = real.crop(box).resize((size - 36, size - 36), Image.LANCZOS)
    else:
        ph = halftone(size - 36, size - 36, seed, tint=(30, 34, 52), bg=(214, 226, 236), kind=kind)
    im.paste(ph, (18, 18))
    d = ImageDraw.Draw(im)
    d.rectangle((18, 18, size - 19, size - 19), outline=INK, width=2)
    d.text((size / 2, size * 1.07), caption, font=fit(d, caption, "hand", size - 30, 30), fill=INK, anchor="mm")
    return im


def lines_text(d, xy, text, name, size, fill=INK, spacing=1.12, anchor="la"):
    x, y = xy
    for ln in text.split("\n"):
        d.text((x, y), ln, font=font(name, size), fill=fill, anchor=anchor)
        y += size * spacing
    return y


# ───────────────────────── 软木板 ─────────────────────────
def board(w=2400, h=1176):
    rng = random.Random(3)
    im = paper(w, h, (211, 154, 92), grain=16, seed=1)
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(2600):  # 软木颗粒
        x, y, r = rng.uniform(0, w), rng.uniform(0, h), rng.uniform(1, 3.5)
        d.ellipse((x - r, y - r, x + r, y + r), fill=rng.choice([(176, 120, 66, 150), (232, 184, 124, 130), (150, 98, 52, 120)]))

    # 标题条：WHO IS / SIMON?
    for txt, col, cx, cy, ang, fs in (("WHO IS", PAPER, 945, 150, 3, 84), ("SIMON?", YELLOW, 1345, 160, -3, 92)):
        f = font("marker", fs)
        tw = int(d.textlength(txt, font=f)) + 56
        strip = card(tw, fs + 36, col, border=4, seed=fs)
        ImageDraw.Draw(strip).text((tw / 2, (fs + 36) / 2), txt, font=f, fill=INK, anchor="mm")
        stick(im, strip, (cx, cy), ang)

    # 名牌
    name = card(560, 360, (255, 252, 244), border=10, seed=5)
    nd = ImageDraw.Draw(name)
    nd.rectangle((22, 22, 537, 337), outline=INK, width=2)
    nd.text((280, 122), "许子豪", font=font("cjk", 128), fill=INK, anchor="mm")
    nd.text((280, 220), "S I M O N   X U", font=font("din", 46), fill=INK, anchor="mm")
    nd.rectangle((60, 252, 500, 255), fill=INK)
    nd.text((280, 284), "知 行 合 一", font=font("cjk", 34), fill=RED, anchor="mm")
    nd.text((280, 320), "AI PRODUCT MANAGER", font=font("mono", 19), fill=INK, anchor="mm")
    stick(im, name, (1160, 470), -1.5)

    # 拍立得
    stick(im, polaroid("city", "shanghai", 11), (250, 250), -7)
    stick(im, polaroid("city", "my city", 12), (590, 230), 5)
    stick(im, polaroid("city", "on the road", 13, size=250), (700, 560), -4)

    # 便签
    def sticky(text, col, size, fs, name_="marker", fill=INK):
        s = card(size[0], size[1], col, seed=fs)
        lines_text(ImageDraw.Draw(s), (22, 20), text, name_, fs, fill)
        return s

    stick(im, sticky("NOW:\nAI PM at\nTencent", YELLOW, (330, 250), 44), (250, 640), 4)
    stick(im, sticky("2023 EASYTRANSFER\n2024 BDO\n2025 DELOITTE\n2026 SOUL\n2026 BYTEDANCE\n2026 TENCENT", (196, 228, 255), (320, 230), 25, "mono"), (410, 930), -3)
    motto = card(330, 170, PINK, seed=36)
    ImageDraw.Draw(motto).text((165, 85), "知行合一", font=font("cjk", 72), fill=INK, anchor="mm")
    stick(im, motto, (1010, 800), 3)
    tag = card(300, 78, (88, 214, 141), seed=9)
    td = ImageDraw.Draw(tag)
    td.text((150, 39), "LIGHTS OUT!", font=fit(td, "LIGHTS OUT!", "impact", 270, 46), fill=INK, anchor="mm")
    stick(im, tag, (1340, 760), -5)

    # WHAT I'M INTO
    wc = card(520, 520, (255, 252, 244), border=8, seed=21)
    wd = ImageDraw.Draw(wc)
    wd.rectangle((8, 8, 511, 96), fill=INK)
    wd.text((260, 52), "WHAT I'M INTO", font=font("impact", 54), fill=PAPER, anchor="mm")
    for i, (a, b) in enumerate((("AI PRODUCTS", "agents · LLM evaluation"), ("F1 & PORSCHE", "pole to win"), ("GAMES", "zelda · god of war · wukong"), ("FILMS", "interstellar · fight club"))):
        y = 122 + i * 96
        wd.text((34, y), f"0{i + 1}", font=font("black", 40), fill=RED)
        wd.text((118, y - 2), a, font=font("din", 46), fill=INK)
        wd.text((118, y + 54), b, font=font("mono", 22), fill=(70, 70, 76))
        wd.line((34, y + 80, 486, y + 80), fill=(190, 186, 176), width=2)
    stick(im, wc, (1830, 400), 2)

    # 工牌 + 收录贴纸
    mc = card(230, 320, (255, 255, 255), border=6, seed=31)
    md = ImageDraw.Draw(mc)
    md.rectangle((6, 6, 223, 84), fill=INK)
    md.text((115, 46), "TENCENT", font=fit(md, "TENCENT", "black", 200, 50), fill=PAPER, anchor="mm")
    for gx, gy in ((2, 0), (3, 0), (1, 1), (2, 1), (3, 1), (1, 2), (3, 2), (0, 3), (2, 2), (3, 3), (2, 3)):
        md.rectangle((66 + gx * 26, 108 + gy * 26, 66 + gx * 26 + 24, 108 + gy * 26 + 24), fill=INK)
    md.text((115, 246), "AI PM", font=font("din", 34), fill=INK, anchor="mm")
    md.text((115, 284), "2026 · SHENZHEN", font=font("mono", 18), fill=RED, anchor="mm")
    stick(im, mc, (2240, 330), -4)
    cx, cy, r = 2210, 690, 118
    pts = [(cx + math.cos(i * math.pi / 14) * (r if i % 2 else r * 0.86), cy + math.sin(i * math.pi / 14) * (r if i % 2 else r * 0.86)) for i in range(28)]
    d.polygon([(x + 6, y + 9) for x, y in pts], fill=(0, 0, 0, 80))
    d.polygon(pts, fill=RED, outline=INK)
    d.text((cx, cy - 26), "BUILD", font=font("impact", 74), fill=PAPER, anchor="mm")
    d.text((cx, cy + 34), "LEARN · SHARE", font=font("din", 30), fill=YELLOW, anchor="mm")

    # 红线把照片、名牌、能力卡连起来
    path = [(250, 110), (590, 96), (1160, 300), (1830, 152), (2240, 180)]
    d.line(path, fill=(200, 30, 40, 255), width=5, joint="curve")
    for (x, y), c in zip(path, (RED, BLUE, YELLOW, GREEN, RED)):
        pin(d, x, y, c)
    for x, y, c in ((250, 530, BLUE), (1010, 730, RED), (1380, 730, YELLOW), (700, 440, GREEN), (410, 830, RED)):
        pin(d, x, y, c, r=11)

    # 右上角蛛网 + 蜘蛛贴纸（致敬蜘蛛侠平行宇宙）
    ox, oy = w - 6, 6
    for k in range(7):
        ang = math.pi / 2 + k * (math.pi / 2) / 6
        d.line((ox, oy, ox + math.cos(ang) * 330, oy + math.sin(ang) * 330), fill=(250, 248, 240, 235), width=3)
    for rr in (70, 130, 195, 265, 330):
        pts = [(ox + math.cos(math.pi / 2 + k * (math.pi / 2) / 6) * rr * (0.92 if k % 2 else 1.0), oy + math.sin(math.pi / 2 + k * (math.pi / 2) / 6) * rr * (0.92 if k % 2 else 1.0)) for k in range(7)]
        d.line(pts, fill=(250, 248, 240, 235), width=3, joint="curve")
    sx, sy = 1560, 800
    d.ellipse((sx - 74, sy - 66, sx + 86, sy + 94), fill=(0, 0, 0, 80))
    d.ellipse((sx - 80, sy - 80, sx + 80, sy + 80), fill=RED, outline=INK, width=5)
    for sd in (-1, 1):
        for j, (a0, a1) in enumerate(((-70, -30), (-40, -5), (20, 55), (45, 85))):
            p1 = (sx + sd * 22, sy - 14 + j * 12)
            p2 = (sx + sd * (22 + 34), sy - 14 + j * 12 + math.tan(math.radians(a0)) * 18)
            p3 = (sx + sd * (22 + 52), sy - 14 + j * 12 + math.tan(math.radians(a1)) * 30)
            d.line((p1, p2, p3), fill=INK, width=7, joint="curve")
    d.ellipse((sx - 20, sy - 44, sx + 20, sy - 8), fill=INK)
    d.ellipse((sx - 27, sy - 14, sx + 27, sy + 58), fill=INK)

    # 底部一行：小彩灯 + 四个词
    for i in range(24):
        x = 620 + i * 72
        y = 978 + 14 * math.sin(i * 0.9)
        d.line((x, y, x + 72, 978 + 14 * math.sin((i + 1) * 0.9)), fill=INK, width=3)
        d.ellipse((x - 11, y + 2, x + 11, y + 30), fill=[RED, YELLOW, GREEN, BLUE, PINK][i % 5], outline=INK, width=2)
    x = 640
    for word in ("EXPLORE", "BUILD", "SHARE", "REPEAT"):
        d.text((x, 1040), word[0], font=font("marker", 104), fill=INK)
        x += d.textlength(word[0], font=font("marker", 104)) + 4
        d.text((x, 1082), word[1:], font=font("marker", 50), fill=INK)
        x += d.textlength(word[1:], font=font("marker", 50)) + 58
    return im


# ───────────────────────── 剪报 / 海报 ─────────────────────────
def clipping(headline, sub, kind, seed, text, w=640, h=820, masthead="THE DAILY SIMON", image=None):
    """一张剪报：报头、大标题、导语、配图，下面是一段真实的报道正文。"""
    im = paper(w, h, NEWS, grain=9, seed=seed)
    d = ImageDraw.Draw(im)
    d.text((w / 2, 44), masthead, font=font("serif", 46), fill=INK, anchor="mm")
    d.rectangle((24, 76, w - 24, 80), fill=INK)
    d.rectangle((24, 86, w - 24, 88), fill=INK)
    y, f = 104, font("impact", 70)
    for line in wrap(d, headline, f, w - 56):
        d.text((28, y), line, font=f, fill=INK)
        y += 74
    d.text((28, y + 6), sub, font=fit(d, sub, "mono", w - 56, 26), fill=RED)
    y += 48
    ph = int(h * 0.23)
    im.paste(halftone(w - 56, ph, seed, kind=kind, image=image), (28, y))
    d.rectangle((28, y, w - 29, y + ph), outline=INK, width=3)
    body(d, (28, y + ph + 16, w - 28, h - 20), text, size=25)
    return im


def f1_car(d, x, y, L, body, accent, trim):
    """侧视的 F1 赛车剪影：车头朝右，(x, y) 是左后轮落地点，L 是车长。不画任何车队标志。"""
    u = L / 100
    def P(pts):
        return [(x + a * u, y - b * u) for a, b in pts]
    d.polygon(P(((4, 6), (4, 22), (12, 22), (16, 14), (34, 15), (42, 24), (52, 26), (60, 20), (88, 13), (100, 9), (100, 5), (4, 5))), fill=body, outline=INK)
    d.polygon(P(((0, 22), (0, 30), (12, 30), (12, 22))), fill=accent, outline=INK)          # 尾翼
    d.polygon(P(((92, 4), (104, 4), (104, 8), (92, 8))), fill=accent, outline=INK)           # 前翼
    d.polygon(P(((44, 24), (50, 31), (56, 31), (58, 24))), fill=trim, outline=INK)          # 头盔
    d.line(P(((40, 26), (53, 33), (62, 22))), fill=INK, width=max(2, int(u * 1.2)))         # halo
    d.polygon(P(((24, 12), (60, 12), (64, 17), (28, 17))), fill=accent)                    # 侧箱上的色带
    for cx, r in ((14, 10), (80, 9)):
        d.ellipse((x + (cx - r) * u, y - 2 * r * u, x + (cx + r) * u, y), fill=INK)
        d.ellipse((x + (cx - r * 0.45) * u, y - r * 1.45 * u, x + (cx + r * 0.45) * u, y - r * 0.55 * u), fill=(120, 124, 132))


def poster(w=640, h=900):
    """墙上的海报：F1 主题，POLE TO WIN。深蓝底 + 红黄配色的车，致敬维斯塔潘，不用车队标志和本人照片。"""
    navy = (14, 27, 64)
    im = paper(w, h, navy, grain=10, seed=77)
    d = ImageDraw.Draw(im)
    for k in range(10):   # 顶上的格子旗
        for r in range(2):
            if (k + r) % 2 == 0:
                d.rectangle((18 + k * 60.4, 18 + r * 30, 18 + (k + 1) * 60.4, 48 + r * 30), fill=PAPER)
    d.text((w / 2, 190), "POLE", font=font("impact", 170), fill=YELLOW, anchor="mm")
    d.text((w / 2, 330), "TO WIN", font=fit(d, "TO WIN", "impact", w - 80, 130), fill=RED, anchor="mm")
    for k in range(7):   # 速度线
        yy = 470 + k * 16
        d.line((40, yy, 40 + 120 + (k % 3) * 60, yy), fill=(90, 110, 170), width=4)
    f1_car(d, 120, 600, 470, (30, 46, 110), RED, YELLOW)
    d.rectangle((40, 612, w - 40, 618), fill=PAPER)
    d.text((w / 2, 690), "P1", font=font("black", 92), fill=YELLOW, anchor="mm")
    d.rectangle((40, 760, w - 40, 764), fill=PAPER)
    d.text((w / 2, 808), "MAX VERSTAPPEN", font=fit(d, "MAX VERSTAPPEN", "din", w - 120, 54), fill=PAPER, anchor="mm")
    d.text((w / 2, 856), "LIGHTS OUT AND AWAY WE GO", font=font("mono", 22), fill=(170, 184, 220), anchor="mm")
    d.rectangle((18, 18, w - 19, h - 19), outline=PAPER, width=8)
    return im


def calendar(w=1080, h=820, year=None):
    """台历正面：年度回顾。上面一条年份，下面 12 个月的小格子，几个月份圈出来当“重要的事”。"""
    year = year or date.today().year
    im = paper(w, h, PAPER, grain=6, seed=81)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w, 170), fill=RED)
    d.text((40, 85), str(year), font=font("impact", 140), fill=PAPER, anchor="lm")
    d.text((w - 40, 64), "YEAR IN", font=font("din", 56), fill=PAPER, anchor="rm")
    d.text((w - 40, 122), "REVIEW", font=font("din", 56), fill=YELLOW, anchor="rm")
    months = "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split()
    cw, ch = (w - 80) / 4, (h - 220) / 3
    for i, m in enumerate(months):
        x0, y0 = 40 + (i % 4) * cw, 200 + (i // 4) * ch
        d.rectangle((x0 + 6, y0 + 6, x0 + cw - 6, y0 + ch - 6), outline=(200, 194, 182), width=2)
        d.text((x0 + 20, y0 + 16), m, font=font("din", 34), fill=INK)
        for k in range(28):
            gx, gy = x0 + 22 + (k % 7) * 30, y0 + 66 + (k // 7) * 26
            d.rectangle((gx, gy, gx + 18, gy + 14), fill=(222, 216, 204))
        if i in (1, 4, 9):   # 2 月 Soul、5 月字节跳动、10 月腾讯
            d.ellipse((x0 + 8, y0 + 4, x0 + 112, y0 + 62), outline=RED, width=5)
    return im


def ticket(title, sub, seed, accent, w=780, h=330):
    """电影票根：左边主票，右边虚线撕口后面的副券。"""
    im = card(w, h, (247, 236, 206), seed=seed)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w, 54), fill=accent)
    d.text((26, 27), "ADMIT ONE", font=font("din", 34), fill=PAPER, anchor="lm")
    d.text((w - 26, 27), f"No. {seed:04d}", font=font("mono", 24), fill=PAPER, anchor="rm")
    d.text((34, 140), title, font=fit(d, title, "impact", w - 270, 92), fill=INK, anchor="lm")
    d.text((34, 222), sub, font=font("mono", 26), fill=(80, 76, 70), anchor="lm")
    d.text((34, 278), "ROW 7 · SEAT 12", font=font("din", 28), fill=accent, anchor="lm")
    for y in range(64, h, 22):
        d.ellipse((w - 214, y, w - 206, y + 8), fill=(190, 178, 150))
    d.text((w - 105, h / 2 + 20), "STUB", font=font("black", 40), fill=accent, anchor="mm")
    return im


def cards_label(w=720, h=240):
    """卡片盒正面的标签：认知积累（播客和公众号）。"""
    im = card(w, h, (240, 226, 196), border=6, seed=91)
    d = ImageDraw.Draw(im)
    d.rectangle((18, 18, w - 19, h - 19), outline=INK, width=3)
    d.text((w / 2, 104), "认知积累", font=font("cjk", 104), fill=INK, anchor="mm")
    d.text((w / 2, 190), "PODCASTS · 公众号", font=font("cjk", 34), fill=RED, anchor="mm")
    return im


def earth(w=2048, h=1024):
    """地球仪的贴图：等距圆柱投影，真实的海陆分布（global-land-mask 自带的 1 km 陆地掩膜），漫画配色；两极是冰。"""
    from global_land_mask import globe
    lat = np.linspace(90, -90, h)
    lon = np.linspace(-180, 180, w, endpoint=False)
    lo, la = np.meshgrid(lon, lat)
    land = globe.is_land(la, lo)
    im = np.empty((h, w, 3), np.uint8)
    im[:] = (43, 107, 228)
    im[land] = (95, 191, 106)
    im[land & (np.abs(la) > 62) & (la < 0) | land & (la > 72)] = (244, 246, 250)
    pic = Image.fromarray(im)
    d = ImageDraw.Draw(pic)
    for k in range(1, 12):   # 经纬线
        d.line((k * w / 12, 0, k * w / 12, h), fill=(255, 255, 255), width=1)
    for k in range(1, 6):
        d.line((0, k * h / 6, w, k * h / 6), fill=(255, 255, 255), width=1)
    return pic


def car_plaque(w=880, h=112):
    """车模展台正面的铭牌。"""
    im = Image.new("RGB", (w, h), (200, 202, 206))
    d = ImageDraw.Draw(im)
    d.rectangle((6, 6, w - 7, h - 7), outline=(40, 40, 44), width=3)
    d.text((w / 2, h / 2 + 2), "PORSCHE 911 GT3 TOURING · GT SILVER · 1:24", font=fit(d, "PORSCHE 911 GT3 TOURING · GT SILVER · 1:24", "din", w - 60, 56), fill=(24, 24, 28), anchor="mm")
    return im


def zine(title, issue, tagline, bg, accent, motif, w=660, h=900):
    im = paper(w, h, bg, grain=6, seed=issue)
    d = ImageDraw.Draw(im, "RGBA")
    yy, xx = np.mgrid[0:h, 0:w]  # 封面底网点
    dots = (np.hypot((xx % 26) - 13, (yy % 26) - 13) < 4 + 5 * yy / h)
    arr = np.asarray(im).copy()
    arr[dots] = (arr[dots] * 0.82).astype(np.uint8)
    im = Image.fromarray(arr)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle((0, 0, w, 190), fill=accent)
    d.rectangle((0, 190, w, 198), fill=INK)
    d.text((w / 2 + 4, 99), title, font=fit(d, title, "impact", w - 60, 150), fill=INK, anchor="mm")
    d.text((w / 2, 95), title, font=fit(d, title, "impact", w - 60, 150), fill=PAPER, anchor="mm")
    d.rounded_rectangle((26, 222, 150, 318), radius=8, fill=PAPER, outline=INK, width=4)
    d.text((88, 250), f"#{issue:02d}", font=font("black", 40), fill=INK, anchor="mm")
    d.text((88, 292), "2026", font=font("mono", 24), fill=RED, anchor="mm")
    cx, cy, r = w / 2, 540, 200
    d.ellipse((cx - r + 10, cy - r + 14, cx + r + 10, cy + r + 14), fill=(0, 0, 0, 90))
    if motif == "bars":
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=INK)
        for i, k in enumerate((0.42, 0.76, 0.54)):
            bx = cx + (i - 1) * 78
            d.rounded_rectangle((bx - 24, cy - r * k, bx + 24, cy + r * k), radius=24, fill=PAPER)
    elif motif == "table":
        d.ellipse((cx - r, cy - r * 0.72, cx + r, cy + r * 0.72), fill=(244, 227, 193), outline=INK, width=8)
        d.ellipse((cx - 70, cy - 50, cx + 70, cy + 50), fill=BLUE, outline=INK, width=6)
        for i, c in enumerate((RED, YELLOW, GREEN, BLUE, (142, 78, 198), ORANGE)):
            a = i * math.tau / 6 + 0.4
            px, py = cx + math.cos(a) * r * 1.02, cy + math.sin(a) * r * 0.76
            d.ellipse((px - 40, py - 62, px + 40, py + 18), fill=c, outline=INK, width=6)
    elif motif == "owl":
        d.polygon([(cx, cy - r), (cx + r * 0.9, cy - r * 0.5), (cx + r * 0.7, cy + r * 0.6), (cx, cy + r), (cx - r * 0.7, cy + r * 0.6), (cx - r * 0.9, cy - r * 0.5)], fill=YELLOW, outline=INK)
        for s in (-1, 1):
            d.ellipse((cx + s * 78 - 62, cy - 90, cx + s * 78 + 62, cy + 34), fill=PAPER, outline=INK, width=8)
            d.ellipse((cx + s * 78 - 24, cy - 52, cx + s * 78 + 24, cy - 4), fill=INK)
        d.polygon([(cx - 26, cy + 30), (cx + 26, cy + 30), (cx, cy + 86)], fill=ORANGE, outline=INK)
    elif motif == "f1":
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(14, 27, 64))
        for k in range(8):
            if k % 2 == 0:
                d.rectangle((cx - r * 0.7 + k * r * 0.175, cy - r * 0.62, cx - r * 0.7 + (k + 1) * r * 0.175, cy - r * 0.45), fill=PAPER)
        f1_car(d, cx - r * 0.82, cy + r * 0.42, r * 1.64, (30, 46, 110), RED, YELLOW)
    elif motif == "film":
        d.rectangle((cx - r, cy - r * 0.62, cx + r, cy + r * 0.62), fill=INK)
        for k in range(9):
            x = cx - r + 14 + k * (2 * r - 28) / 8
            for yy_ in (cy - r * 0.55, cy + r * 0.47):
                d.rectangle((x - 9, yy_, x + 9, yy_ + 16), fill=PAPER)
        for k in range(3):
            x0 = cx - r + 26 + k * (2 * r - 52) / 3
            d.rectangle((x0 + 6, cy - r * 0.36, x0 + (2 * r - 52) / 3 - 6, cy + r * 0.36), fill=[(255, 170, 196), (88, 166, 255), (255, 214, 64)][k])
        d.polygon([(cx - 40, cy - 56), (cx - 40, cy + 56), (cx + 58, cy)], fill=PAPER, outline=INK)
        d.text((cx, cy + r * 0.82), "AI", font=font("black", 60), fill=INK, anchor="mm")
    elif motif == "phone":
        d.rounded_rectangle((cx - r * 0.55, cy - r, cx + r * 0.55, cy + r), radius=46, fill=INK)
        d.rounded_rectangle((cx - r * 0.47, cy - r * 0.9, cx + r * 0.47, cy + r * 0.9), radius=32, fill=PAPER)
        d.rounded_rectangle((cx - 40, cy - r * 0.86, cx + 40, cy - r * 0.76), radius=12, fill=INK)
        for k in range(6):
            x0, y0 = cx - r * 0.38 + (k % 3) * r * 0.27, cy - r * 0.6 + (k // 3) * r * 0.32
            d.rounded_rectangle((x0, y0, x0 + r * 0.2, y0 + r * 0.2), radius=12, fill=[RED, BLUE, YELLOW, GREEN, ORANGE, PINK][k])
    elif motif == "apple":   # 《假如那颗苹果》：一颗红苹果正往下掉，砸向一顶假发
        d.ellipse((cx - r * 0.8, cy + r * 0.35, cx + r * 0.8, cy + r * 1.0), fill=PAPER, outline=INK, width=8)   # 牛顿的白卷发
        for k in range(5):
            x = cx - r * 0.6 + k * r * 0.3
            d.ellipse((x - 34, cy + r * 0.28, x + 34, cy + r * 0.6), fill=PAPER, outline=INK, width=6)
        ax, ay, ar = cx, cy - r * 0.3, r * 0.42
        d.ellipse((ax - ar, ay - ar, ax + ar, ay + ar * 0.9), fill=RED, outline=INK, width=8)
        d.ellipse((ax - ar * 0.55, ay - ar * 0.6, ax - ar * 0.2, ay - ar * 0.25), fill=(255, 150, 150))
        d.line((ax, ay - ar * 0.8, ax + 12, ay - ar * 1.35), fill=INK, width=10)
        d.ellipse((ax + 12, ay - ar * 1.45, ax + 80, ay - ar * 1.1), fill=GREEN, outline=INK, width=5)
        for k in (-1, 0, 1):   # 下落的速度线
            d.line((ax + k * 40, ay - ar * 1.9, ax + k * 40, ay - ar * 1.5), fill=INK, width=6)
        d.text((cx, cy + r * 0.18), "1666", font=font("black", 40), fill=INK, anchor="mm")
    elif motif == "receipt":   # 忍了么：一张待付款小票，盖着红色「已忍住」章
        d.polygon([(cx - r * 0.6, cy - r), (cx + r * 0.6, cy - r)] + [(cx + r * 0.6 - k * r * 0.12, cy + r * (0.92 if k % 2 else 1.0)) for k in range(11)], fill=PAPER, outline=INK)
        d.text((cx, cy - r * 0.78), "UNPAID", font=font("black", 40), fill=INK, anchor="mm")
        for k in range(5):
            y = cy - r * 0.5 + k * r * 0.22
            d.line((cx - r * 0.45, y, cx + r * 0.1, y), fill=INK, width=6)
            d.line((cx + r * 0.25, y, cx + r * 0.45, y), fill=INK, width=6)
        st = Image.new("RGBA", (300, 150), (0, 0, 0, 0))
        sd = ImageDraw.Draw(st)
        sd.rounded_rectangle((6, 6, 294, 144), radius=18, outline=RED, width=10)
        sd.text((150, 75), "已忍住", font=font("cjk", 80), fill=RED, anchor="mm")
        st = st.rotate(14, expand=True, resample=Image.BICUBIC)
        im.paste(st, (int(cx - st.width / 2 + 20), int(cy + r * 0.05)), st)
    elif motif == "notes":
        for i, c in enumerate(((255, 255, 255), (255, 244, 200), (255, 255, 255))):
            ox = (i - 1) * 46
            d.rectangle((cx - 150 + ox, cy - 190 + i * 30, cx + 150 + ox, cy + 150 + i * 30), fill=c, outline=INK, width=6)
        lines_text(d, (cx - 96, cy - 84), "Notes\nIdeas\nDrafts\nTo-dos\nPlans", "hand", 36, fill=(40, 40, 52), spacing=1.26)
    d.rectangle((0, h - 120, w, h), fill=INK)
    d.text((w / 2, h - 60), tagline, font=fit(d, tagline, "din", w - 50, 60), fill=YELLOW, anchor="mm")
    d.rectangle((0, 0, w - 1, h - 1), outline=INK, width=6)
    return im


# ───────────────────────── 笔记本 / 屏幕 / 小纸片 ─────────────────────────
def notebook(w=1400, h=980):
    rng = random.Random(8)
    im = paper(w, h, (252, 248, 236), grain=5, seed=8)
    d = ImageDraw.Draw(im)
    d.rectangle((w / 2 - 3, 0, w / 2 + 3, h), fill=(205, 198, 182))
    for y in range(90, h - 40, 46):
        d.line((40, y, w / 2 - 30, y), fill=(206, 220, 236), width=2)

    def wobble(p0, p1, width=5):
        n = 8
        pts = [(p0[0] + (p1[0] - p0[0]) * i / n + rng.uniform(-2.5, 2.5), p0[1] + (p1[1] - p0[1]) * i / n + rng.uniform(-2.5, 2.5)) for i in range(n + 1)]
        d.line(pts, fill=INK, width=width, joint="curve")

    def sketch_box(x, y, bw, bh, label, fill=None):
        if fill:
            d.rectangle((x + 4, y + 4, x + bw - 4, y + bh - 4), fill=fill)
        for a, b in (((x, y), (x + bw, y)), ((x + bw, y), (x + bw, y + bh)), ((x + bw, y + bh), (x, y + bh)), ((x, y + bh), (x, y))):
            wobble(a, b)
        d.text((x + bw / 2, y + bh / 2), label, font=fit(d, label, "hand", bw - 20, 40), fill=INK, anchor="mm")

    d.text((60, 30), "notes — how I build", font=font("hand", 46), fill=RED)
    flow = [("idea", YELLOW), ("sketch", None), ("prototype", (196, 228, 255)), ("review", None)]
    for i, (lb, col) in enumerate(flow):
        y = 120 + i * 150
        sketch_box(110, y, 300, 92, lb, col)
        if i < 3:
            wobble((260, y + 96), (260, y + 146), 4)
            d.polygon([(248, y + 134), (272, y + 134), (260, y + 152)], fill=INK)
    for j, lb in enumerate(("design", "build", "share")):
        sketch_box(470, 430 + j * 120, 190, 80, lb, PINK if j < 2 else None)
        wobble((412, 615), (468, 470 + j * 120), 3)
    d.text((70, 760), "small steps, real work.\nlearn along the way.", font=font("hand", 44), fill=INK)

    x0 = w / 2 + 60
    d.text((x0, 40), "Simon.", font=font("hand", 110), fill=INK)
    d.line((x0, 168, x0 + 300, 160), fill=RED, width=6)
    for i, (txt, done) in enumerate((("set up the repo", True), ("render the desk", True), ("personal site, 10 styles", True), ("fill in real content", False), ("add photos", False), ("write the first post", False))):
        y = 230 + i * 86
        d.rectangle((x0, y, x0 + 46, y + 46), outline=INK, width=5)
        if done:
            d.line((x0 + 6, y + 24, x0 + 20, y + 40, x0 + 54, y - 8), fill=RED, width=8)
        d.text((x0 + 70, y - 2), txt, font=fit(d, txt, "hand", w / 2 - 170, 42), fill=INK)
    sx, sy = w - 150, 820  # 小星星
    d.polygon([(sx + math.cos(i * math.pi / 5 - math.pi / 2) * (70 if i % 2 == 0 else 30), sy + math.sin(i * math.pi / 5 - math.pi / 2) * (70 if i % 2 == 0 else 30)) for i in range(10)], fill=YELLOW, outline=INK)
    return im


def screen(w=1600, h=1000):
    im = wallpaper(w, h, seed=7).convert("RGB")
    d = ImageDraw.Draw(im, "RGBA")
    d.rounded_rectangle((120, 150, w - 120, h - 130), radius=36, fill=(14, 14, 18, 236), outline=(255, 255, 255, 60), width=3)
    x = 180
    for ch, col in zip("TALK TO ME", [RED, YELLOW, PAPER, PINK, None, ORANGE, YELLOW, None, PAPER, RED]):  # 拼贴字母标题
        if col:
            d.rectangle((x, 196, x + 62, 268), fill=col)
            d.text((x + 31, 232), ch, font=font("impact", 58), fill=INK, anchor="mm")
        x += 70 if col else 28
    d.text((w / 2, 440), "Hi, I'm Simon.", font=font("serif", 170), fill=(255, 122, 61), anchor="mm")
    d.text((w / 2, 580), "Welcome to my desk. Ask me anything.", font=font("mono", 38), fill=(235, 235, 240), anchor="mm")
    cx = 190
    for chip in ("Who are you?", "What do you build?", "How to reach you?", "Why 10 styles?"):
        tw = d.textlength(chip, font=font("mono", 30)) + 48
        d.rounded_rectangle((cx, 690, cx + tw, 750), radius=10, outline=(255, 255, 255, 150), width=3)
        d.text((cx + tw / 2, 720), chip, font=font("mono", 30), fill=PAPER, anchor="mm")
        cx += tw + 22
    d.rounded_rectangle((w / 2 - 250, 44, w / 2 + 250, 116), radius=36, fill=(20, 20, 24, 240))  # 语音状态条
    d.ellipse((w / 2 - 226, 62, w / 2 - 190, 98), fill=RED)
    d.text((w / 2 + 16, 80), "Ask me anything", font=font("mono", 30), fill=PAPER, anchor="mm")
    return im


def small_papers(out):
    for i, (txt, col) in enumerate((("CLICK THE\nKEYBOARD.\nTALK TO ME.", YELLOW), ("PICK A ZINE.\nPRESS PLAY.", YELLOW), ("TAP THE MASK\n>> NEW\nUNIVERSE", PINK))):
        s = card(360, 300, col, seed=40 + i)
        lines_text(ImageDraw.Draw(s), (24, 26), txt, "marker", 46)
        s.save(out / f"sticky_{i}.png")
    c = card(700, 400, (255, 255, 255), border=6, seed=50)
    d = ImageDraw.Draw(c)
    d.rectangle((6, 6, 180, 393), fill=INK)
    d.text((93, 200), "S", font=font("impact", 220), fill=PAPER, anchor="mm")
    d.text((216, 70), "SIMON XU", font=font("black", 64), fill=INK)
    d.text((216, 150), "AI Product Manager", font=font("mono", 30), fill=INK)
    d.text((216, 236), "xuzihao1218@126.com", font=font("mono", 28), fill=RED)
    d.text((216, 282), "github.com/simon200401", font=font("mono", 28), fill=INK)
    d.text((216, 328), "simon200401.github.io", font=font("mono", 28), fill=INK)
    c.save(out / "bizcard.png")
    # pid 是 site/assets/photos/ 里的照片编号；填 None 就画网点假照片
    for name, kind, caption, seed, pid in (("a", "city", "coast", 61, None), ("b", "person", "street", 62, None), ("c", "city", "trees", 63, None)):
        polaroid(kind, caption, seed, pid=pid).save(out / f"polaroid_{name}.png")


def newspaper(w=780, h=1020):
    """桌上那份报纸：AI、研究、行业各一条真实新闻（标题、来源、日期、摘要），取自导入的新闻数据。"""
    f = ASSETS / "data/news.json"
    items = json.loads(f.read_text())["items"] if f.exists() else []
    # 只取 AI / 研究 / 行业三类：这是一份 AI 报纸，国际时政留给新闻面板
    stories = [n for cat in ("ai", "research", "industry") for n in [next((x for x in items if x["category"] == cat and x["title"].isascii()), None)] if n]
    im = paper(w, h, NEWS, grain=9, seed=90)
    d = ImageDraw.Draw(im)
    d.text((w / 2, 62), "AI DAILY", font=font("serif", 104), fill=INK, anchor="mm")
    d.rectangle((26, 122, w - 26, 128), fill=INK)
    d.text((30, 136), "SIMON'S NEWS DESK", font=font("mono", 22), fill=INK)
    d.text((w - 30, 136), stories[0]["date"] if stories else "", font=font("mono", 22), fill=RED, anchor="ra")
    d.rectangle((26, 168, w - 26, 170), fill=INK)
    y = 184
    for i, n in enumerate(stories):
        if y > h - 150:
            break
        tag = n["category"].upper()
        d.rectangle((30, y + 2, 30 + d.textlength(tag, font=font("din", 26)) + 16, y + 32), fill=RED)
        d.text((38, y + 3), tag, font=font("din", 26), fill=PAPER)
        d.text((w - 30, y + 6), f"{n['source']} · {n['date']}", font=font("mono", 20), fill=(90, 88, 84), anchor="ra")
        y += 40
        fs = 52 if i == 0 else 36
        fnt = font("impact" if i == 0 else "black", fs)
        for line in wrap(d, n["title"], fnt, w - 60)[: 3 if i == 0 else 2]:
            d.text((30, y), line, font=fnt, fill=INK)
            y += fs + 4
        y = body(d, (30, y + 4, w - 30, h - 24), n["summary"], size=25, max_lines=6 if i == 0 else 5) + 12
        d.line((30, y, w - 30, y), fill=(150, 146, 138), width=2)
        y += 12
    return im


# ───────────────────────── 环境材质 ─────────────────────────
def brick(w=4096, h=1900, bw=150, bh=56, gap=7):
    rng = random.Random(4)
    im = Image.new("RGB", (w, h), (196, 188, 176))
    d = ImageDraw.Draw(im)
    for r in range(h // bh + 1):
        off = -(bw // 2) if r % 2 else 0
        for c in range(w // bw + 2):
            t = rng.choice([0, 0, 0, 1, 1, 2, 3])
            col = [(238, 233, 224), (228, 222, 211), (246, 242, 235), (214, 205, 192)][t]
            d.rectangle((off + c * bw + gap / 2, r * bh + gap / 2, off + (c + 1) * bw - gap / 2, (r + 1) * bh - gap / 2), fill=col)
    return im.filter(ImageFilter.GaussianBlur(0.8))


def wood(w=2560, h=1100, planks=7):
    rng = random.Random(6)
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    ph = h / planks
    for p in range(planks):
        base = rng.choice([(190, 128, 76), (202, 140, 86), (178, 116, 68), (196, 134, 80)])
        d.rectangle((0, p * ph, w, (p + 1) * ph), fill=base)
        for _ in range(26):  # 木纹
            y = p * ph + rng.uniform(4, ph - 4)
            x0 = rng.uniform(-200, w)
            ln = rng.uniform(200, 900)
            d.line([(x0 + ln * i / 6, y + rng.uniform(-3, 3)) for i in range(7)], fill=tuple(int(c * rng.uniform(0.84, 0.94)) for c in base), width=rng.choice([2, 3, 4]))
        d.rectangle((0, (p + 1) * ph - 3, w, (p + 1) * ph), fill=(120, 76, 44))
        for s in range(rng.randint(1, 2)):
            x = rng.uniform(200, w - 200)
            d.rectangle((x, p * ph, x + 3, (p + 1) * ph), fill=(120, 76, 44))
    return im.filter(ImageFilter.GaussianBlur(0.7))


def facade(seed, wall, w=512, h=1024, cols=10, rows=26):
    rng = random.Random(seed)
    im = Image.new("RGB", (w, h), wall)
    d = ImageDraw.Draw(im)
    cw, rh = w / cols, h / rows
    for r in range(rows):
        for c in range(cols):
            lit = rng.random()
            col = (255, 214, 128) if lit < 0.28 else ((255, 241, 190) if lit < 0.36 else tuple(int(v * 0.55) for v in wall))
            d.rectangle((c * cw + cw * 0.18, r * rh + rh * 0.2, (c + 1) * cw - cw * 0.18, (r + 1) * rh - rh * 0.22), fill=col)
    return im


def main(out):
    out.mkdir(parents=True, exist_ok=True)
    board().save(out / "board.png")
    # 墙上四张剪报：几段经历里最值得贴出来的事
    clips = [
        ("AGENTCALL GOES LIVE", "ByteDance · 2026", "notes", None,
         "SHANGHAI — An outbound-calling agent workflow now covers 80% of scenarios, lifting merchant conversion intent by 15.7%. A simulated merchant passed double-blind tests 98% of the time."),
        ("INTENT ACCURACY: 73% TO 90%", "LLM evaluation · 2026", "notes", None,
         "SHANGHAI — A four-dimension evaluation system with multi-agent review, a new taxonomy, prompt tuning and SFT pushed intent recognition from 73.3% to 90.5%."),
        ("MEET SIMON XU", "AI product manager · racing fan", "person", avatar(),
         "SHENZHEN — Six internships in four years, from data analysis and ESG to AI agents. Drives a Panamera, follows Verstappen, and is about to adopt a cat called Xiaobu."),
        ("DWELL TIME UP 34.7%", "Soul App · 2026", "podium", None,
         "SHANGHAI — A tag-and-feedback matching framework and a careful A/B rollout raised average time per room entry by 34.7%, with every core metric up."),
    ]
    for i, (hl, sub, kind, image, text) in enumerate(clips):
        clipping(hl, sub, kind, 20 + i, text, h=820 if i % 2 == 0 else 760, image=image).save(out / f"clip_{i}.png")
    poster().save(out / "poster.png")
    # 桌上三本项目刊物（文件名不变，Blender 按文件名找贴图）
    zine("PITMIND", 1, "F1, EXPLAINED.", (255, 122, 61), INK, "f1").save(out / "zine_echo.png")
    zine("WHAT IF?", 2, "THAT APPLE.", (88, 166, 255), RED, "apple").save(out / "zine_roundtable.png")
    zine("RENLEME", 3, "PAUSE 15 SEC.", (255, 214, 64), INK, "receipt").save(out / "zine_athena.png")
    notebook().save(out / "notebook.png")
    screen().save(out / "screen.png")
    small_papers(out)
    earth().save(out / "earth.png")
    car_plaque().save(out / "car_plaque.png")
    calendar().save(out / "calendar.png")
    cards_label().save(out / "cards_label.png")
    # 三张电影票根：最喜欢的三部
    ticket("INTERSTELLAR", "do not go gentle", 1, BLUE).save(out / "ticket_0.png")
    ticket("FIGHT CLUB", "first rule: ...", 2, RED).save(out / "ticket_1.png")
    ticket("SPIDER-VERSE", "anyone can wear the mask", 3, (142, 78, 198)).save(out / "ticket_2.png")
    newspaper().save(out / "newspaper.png")
    brick(w=3320, h=2200, bw=118, bh=44, gap=6).save(out / "brick.png")
    wood().save(out / "wood.png")
    for i, wall in enumerate(((52, 66, 96), (78, 96, 128), (38, 48, 72), (104, 122, 146))):
        facade(100 + i, wall).save(out / f"facade_{i}.png")
    print("textures ok ->", out)


if __name__ == "__main__":
    main(Path(sys.argv[1] if len(sys.argv) > 1 else "blender/tex"))
