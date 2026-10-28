# Zihao Xu 的个人网站：一张桌子，十个宇宙

Blender 建模的工位场景，同一个机位渲染后合成 10 种印刷 / 漫画风格，网页里用 WebGL 切换。点桌上的物件看对应的内容，点面具或按空格换宇宙。

改编自 [EdwinjJ1/personal-website](https://github.com/EdwinjJ1/personal-website) 的 `002/`（MIT），原作者的文字、照片、项目和 logo 都已经换掉。现在桌上和面板里的内容是占位，标了 `TODO` 的地方要换成自己的。

## 怎么跑

```sh
npm run dev      # http://localhost:4173
npm test         # 坐标换算 + 内容完整性
```

`site/` 是纯静态站，没有构建步骤。

## 改内容

| 想换的东西 | 改哪里 | 要不要重新渲染 |
|---|---|---|
| 面板里的自我介绍、项目、经历、联系方式 | `site/js/content.js` | 不用 |
| 项目列表、博客、友链、摄影清单 | `site/assets/data/*.json`，照片放 `site/assets/photos/` | 不用 |
| 软木板、剪报、海报、刊物封面、名片、屏幕上的字 | `pipeline/textures.py` | 要 |
| 桌上有什么、摆在哪 | `blender/layout.py`（物件的 `hot="名字"` 就是网页里的热点名） | 要 |
| 某个宇宙的画风 | `pipeline/stylize.py` 里同名的函数 | 只跑 `npm run stylize` |
| 唱片机的歌单 | `pipeline/sync_music.py` 的 `PLAYLIST_ID` | 不用 |
| 显示器里的 AI 对话 | 部署 `workers/api`（Cloudflare Worker），把地址填进 `content.js` 的 `CHAT.api`；留空就只用预设回答 | 不用 |

加了新热点要在 `content.js` 的 `HOTS` 和 `LABELS` 里登记，测试会检查。

## 重新出图

```sh
npm run textures       # 贴图 → blender/tex
npm run render         # Blender 分通道渲染 → build/passes（4K；草稿用 npm run render:draft，1600 宽）
npm run stylize        # 合成 10 种风格 + 热点图 → site/assets
```

需要 Blender 5.x、uv、Node 22。没有装 Blender 的话，`pip install bpy` 也行：

```sh
python -c "import runpy, sys; sys.argv = ['blender', '--', '--out', 'build/passes', '--width', '1600']; runpy.run_path('blender/scene.py', run_name='__main__')"
```

贴图用的拉丁字体在 `pipeline/fonts/`；中文字体会在系统里找（macOS 的冬青黑、Linux 的文泉驿或 Noto CJK），都没有就在 `textures.py` 的 `CJK_FONTS` 里加一个路径。

## 部署

推到 `main` 就会通过 `.github/workflows/deploy.yml` 发布到 GitHub Pages，每 6 小时还会自动同步一次新闻和 GitHub 贡献墙。第一次需要在仓库 **Settings → Pages → Source** 里选 **GitHub Actions**。

网址：`https://simon200401.github.io/Personal-website/`

## 说明

- 蜘蛛面具、蛛网、EARTH 编号来自原项目对《蜘蛛侠：平行宇宙》的致敬，图形是原作者自己画的。
- 网页字体（Bangers、Comic Neue）自托管在 `site/fonts/`，国内访问不依赖 Google Fonts。
- 新闻来自公开 RSS（Google AI、arXiv、BBC），每次部署时更新。
