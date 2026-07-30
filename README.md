# 永世乐土

昔米露的二次元风格个人博客，托管于 GitHub Pages。

## 最常用：发布一篇新文章

日常写作只需要操作 `content/posts/`，不要修改 `app.js` 或自动生成的 `generated/posts.js`。

### 直接在 GitHub 网页发布

1. 打开仓库中的 `content/posts/_template.md`。
2. 点击右上角的复制按钮，将模板内容复制下来。
3. 返回 `content/posts`，点击 `Add file → Create new file`。
4. 文件名填写 `年-月-日-英文短标题.md`，例如：

   ```text
   2026-07-20-rainy-day.md
   ```

5. 粘贴模板，修改标题、日期、分类、摘要和正文。
6. 把 `draft: true` 改成 `draft: false`。
7. 点击 `Commit changes`。GitHub Actions 会自动整理文章并发布网站。

### 使用 GitHub Desktop 发布

1. 在本地仓库的 `content/posts/` 中复制 `_template.md`。
2. 重命名并编辑文章。
3. 在 GitHub Desktop 填写提交说明，例如“新增雨天随笔”。
4. 点击 `Commit to main`，然后点击 `Push origin`。

## 文章格式

```markdown
---
id: rainy-day-2026
title: 雨天随笔
date: 2026-07-20
category: 随笔
readTime: 3 分钟
accent: violet
emoji: 🌧️
featured: false
excerpt: 这是一段显示在首页的摘要。
tags: ["生活", "雨天", "随笔"]
draft: false
---

# 雨天随笔

从这里开始写正文。
```

字段说明：

| 字段 | 规则 |
| --- | --- |
| `id` | 必须唯一，只用小写英文、数字和短横线 |
| `date` | 使用 `YYYY-MM-DD` |
| `category` | 建议与 `content/site.js` 中的分类一致 |
| `accent` | 可用 `violet`、`cyan`、`pink`、`amber` |
| `featured` | `true` 表示优先成为首页推荐文章 |
| `draft` | `true` 不发布；`false` 正式发布 |
| `tags` | 使用英文双引号和英文逗号 |

正文支持标题、列表、引用、粗体、链接、图片、行内代码和围栏代码块。

## 上传文章图片

推荐结构：

```text
assets/
└─ posts/
   └─ rainy-day-2026/
      ├─ cover.webp
      └─ photo-01.webp
```

Markdown 中这样引用：

```markdown
![雨天街道](assets/posts/rainy-day-2026/photo-01.webp)
```

推荐使用 WebP 或 JPG，单张尽量控制在 500 KB 以内，文件名只用小写英文、数字和短横线。

## 修改个人资料

编辑：

```text
content/site.js
```

其中包括：

- 博客名称、昵称、简介
- GitHub、B站等社交链接
- 首页文章分类
- 项目、成长足迹和友链

## 自动构建机制

每次向 `main` 分支提交时，GitHub Actions 会执行：

```text
content/posts/*.md
        ↓
scripts/build-posts.mjs
        ↓
generated/posts.js
        ↓
GitHub Pages
```

构建程序会自动完成：

- 忽略 `_template.md` 和 `draft: true` 的草稿
- 检查必填字段及重复文章 ID
- 按日期从新到旧排序
- 生成首页搜索、分类和文章阅读所需的数据

本地预览前运行：

```bash
node scripts/build-posts.mjs
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 目录结构

```text
├─ content/
│  ├─ site.js
│  └─ posts/
│     ├─ _template.md
│     └─ 2026-07-18-summer-night.md
├─ generated/
│  └─ posts.js
├─ scripts/
│  └─ build-posts.mjs
├─ assets/posts/
├─ index.html
├─ app.js
├─ styles.css
└─ .github/workflows/pages.yml
```

## 发布每日学习笔记

“学习笔记”是与“技术”“随笔”“ACG”“教程”并列的文章分类。日常更新步骤：

1. 复制 `content/posts/_learning-note-template.md`。
2. 重命名为 `YYYY-MM-DD-英文短标题.md`。
3. 填写标题、日期、摘要、标签和正文，保留 `category: 学习笔记`。
4. 将 `draft: true` 改为 `draft: false`。
5. 使用 GitHub Desktop 提交并推送；GitHub Actions 会自动更新首页。

发布后可在首页文章分类中的“学习笔记”标签查看。
