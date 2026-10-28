# Zihao Xu 的个人网站

Next.js 15 静态站，部署在 GitHub Pages。中英双语切换、深浅色主题、深色模式下有 WebGL 星空背景。
视觉和部分组件改编自 [EdwinjJ1/personal-website](https://github.com/EdwinjJ1/personal-website) 的 `001/`（MIT）。

## 本地运行

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # 输出到 out/
```

## 改内容

所有内容都在 `src/data/`，每段文字都写成 `{ zh: '中文', en: 'English' }`。标了 `TODO` 的是占位，要换成你自己的。

| 想改的 | 文件 |
|---|---|
| 名字、一句话介绍、所在地、自我介绍、社交链接、头像 | `src/data/profile.ts` |
| 经历时间线、技能 | `src/data/profile.ts` |
| 项目 | `src/data/projects.ts` |
| 博客文章 | `src/data/posts.ts` |
| 摄影 | `src/data/photos.ts`，图片放 `public/photos/` |
| 网站标题、简介、网址 | `src/app/layout.tsx` |

头像：把方形照片放到 `public/avatar.jpg`，再把 `profile.ts` 里的 `avatar` 改成 `'/avatar.jpg'`。
照片：先缩到长边 2000px 左右再放进仓库，原图别提交，不然仓库会很快变大。

## 部署

推到 `main` 就会通过 `.github/workflows/deploy.yml` 自动发布。第一次需要在仓库的 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
网址是 `https://simon200401.github.io/Personal-website/`。以后绑定自定义域名时，Pages 会自动把子路径去掉，不用改代码。
