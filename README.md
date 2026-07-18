# 个人博客

零框架、零构建依赖的响应式静态博客，可直接部署到 GitHub Pages。
https://truelysia0.github.io/Elysia.github.io/#home

## 已包含

- 原创二次元氛围的夜空、月亮、城市与樱花视觉
- 首页、文章、作品、成长足迹、关于、友链六个板块
- 文章分类、关键词搜索、文章弹窗与 URL 定位
- 深色/浅色主题、移动端导航、滚动动画
- GitHub Actions 自动部署
- 所有主要内容集中在 `content.js` 中维护

## 你需要补充的内容

打开 `content.js`，依次修改：

1. `site`：博客名、昵称、简介、所在地、GitHub、邮箱和社交账号
2. `categories`：你想使用的文章分类
3. `posts`：文章标题、摘要、标签和正文
4. `projects`：代表项目或作品集
5. `timeline`：个人经历与成长节点
6. `friends`：友链名称、介绍和地址

推荐保留的板块组合：

| 类型 | 推荐板块 |
| --- | --- |
| 技术向 | 技术文章、项目作品、开源贡献、关于我 |
| 创作向 | 随笔、作品集、摄影/绘画、灵感收藏、友链 |
| ACG 向 | 动画短评、游戏记录、收藏展示、活动游记 |
| 综合型 | 当前模板的六板块结构 |

## 本地预览

直接双击 `index.html` 即可。也可以在该目录运行：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

### 方案 A：个人主页仓库（推荐）

1. 在 GitHub 创建公开仓库：`你的用户名.github.io`
2. 将本目录全部文件上传到仓库根目录
3. 打开仓库 `Settings → Pages`
4. 在 `Build and deployment → Source` 选择 `GitHub Actions`
5. 推送到 `main` 后，等待 Actions 出现绿色对勾
6. 访问 `https://你的用户名.github.io`

### 方案 B：普通项目仓库

仓库可使用任意名称。部署方式相同，访问地址为：

`https://你的用户名.github.io/仓库名/`

本模板使用相对路径，因此无需修改资源地址。

## 使用自定义域名

1. 在仓库根目录新建 `CNAME` 文件，内容只写域名，例如 `blog.example.com`
2. 在域名服务商处添加一条 CNAME 记录，指向 `你的用户名.github.io`
3. 在 GitHub Pages 设置中填写域名并启用 HTTPS

## 添加文章

复制 `content.js` 中 `posts` 数组里的一个对象，确保 `id` 唯一。正文支持以下 Markdown 子集：

- `#`、`##`、`###` 标题
- 无序/有序列表
- `> 引用`
- `` `行内代码` ``
- `**粗体**`

## 替换首页插画

当前默认视觉完全由 CSS 绘制，不依赖外部图片。如果要使用自己的原创插画：

1. 将图片放入 `assets/hero.webp`
2. 在 `styles.css` 的 `.hero` 规则中，将最后一层背景换成 `url("assets/hero.webp") center/cover`
3. 建议尺寸 1920×1080，人物放在右侧，左侧保留文字空间

请使用原创、已获授权或明确允许使用的图片，避免直接使用商业动漫角色立绘。

## 可选的后续升级

- 接入 Giscus：使用 GitHub Discussions 作为文章评论
- 接入 Umami：隐私友好的访问统计
- 使用独立 Markdown 文件和静态站点生成器 Astro/Hugo 管理大量文章
- 增加 RSS、站内全文索引、标签页和分页

## 文件结构

```text
anime-blog/
├─ .github/workflows/pages.yml  # 自动部署
├─ .nojekyll                    # 关闭 Jekyll 处理
├─ index.html                   # 页面结构
├─ styles.css                   # 视觉与响应式样式
├─ content.js                   # 你的资料和全部内容
├─ app.js                       # 搜索、主题和文章逻辑
└─ README.md                    # 使用说明
```

## License

代码可用于你的个人博客。由你补充的文章、图片和个人内容版权归你所有。
