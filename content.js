/*
 * 这是全站最主要的内容配置文件。
 * 替换文字、链接、文章和项目后直接提交 GitHub，无需改动 HTML。
 */
window.BLOG_DATA = {
  site: {
    name: "永世乐土",
    owner: "昔米露",
    eyebrow: "WELCOME TO MY LITTLE UNIVERSE",
    description: "历历浮生，无非败而后成。",
    status: "持续更新中",
    location: "中国",
    github: "https://github.com/TruElysia",
    avatarText: "星",
    about: "一万个冬天以后是一万个春天，一万次离别后是一万次相见，或许过往已无可溯洄，但好在还有可以与你相遇的明天。",
    skills: [ "AI 探索", "动漫", "工具分享"],
    socials: [
      { name: "GitHub", url: "https://github.com/TruElysia", icon: "⌘" },
      //{ name: "邮箱", url: "mailto:you@example.com", icon: "✉" },
      { name: "哔哩哔哩", url: "https://space.bilibili.com/3546799103019529/", icon: "▣" }
    ]
  },

  // 推荐板块：技术 / 随笔 / ACG / 摄影 / 教程。可以任意增删。
  categories: ["全部", "技术", "随笔", "ACG", "教程"],

  posts: [
    {
      id: "hello-world",
      title: "你好，世界：从这里开始记录",
      category: "随笔",
      date: "2026-07-17",
      readTime: "4 分钟",
      featured: true,
      accent: "violet",
      emoji: "🌌",
      excerpt: "为什么要重新拥有一块属于自己的互联网角落，以及我准备在这里分享什么。",
      tags: ["博客", "生活", "开始"],
      content: `# 你好，欢迎来到我的博客

这是第一篇示例文章。你可以在 \`content.js\` 中直接替换这里的文字。

## 我会在这里记录

- 学习新技术时的笔记与踩坑
- 做个人项目时的思考与复盘
- 喜欢的动漫、音乐与书
- 旅行、摄影和生活里的小事

> 愿我们始终对世界保持好奇，也愿每一次记录都成为通往未来的路标。

## 下一步

修改站点资料、加入你的第一篇文章，然后推送到 GitHub。这个小小宇宙就正式开始运转了。`
    },
    {
      id: "github-pages-guide",
      title: "用 GitHub Pages 免费部署个人网站",
      category: "教程",
      date: "2026-07-12",
      readTime: "8 分钟",
      accent: "cyan",
      emoji: "🚀",
      excerpt: "从创建仓库到自动发布，一份不绕弯的 GitHub Pages 上线指南。",
      tags: ["GitHub", "部署", "Pages"],
      content: `# GitHub Pages 部署指南

## 1. 创建仓库

推荐将仓库命名为 \`你的用户名.github.io\`，这样网站地址最简洁。

## 2. 上传文件

把本模板中的所有文件推送到仓库的 \`main\` 分支。

## 3. 开启 Pages

进入 **Settings → Pages**，Source 选择 **GitHub Actions**。模板自带的工作流会自动完成发布。

## 4. 等待部署

打开仓库顶部的 Actions 页面，绿色对勾出现后即可访问网站。`
    },
    {
      id: "my-anime-list",
      title: "最近看过的动画与短评",
      category: "ACG",
      date: "2026-07-06",
      readTime: "6 分钟",
      accent: "pink",
      emoji: "🍡",
      excerpt: "记录这个季度让我笑过、感动过，也认真思考过的作品。",
      tags: ["动画", "季度总结", "推荐"],
      content: `# 最近的动画清单

这里可以按季度记录你的追番体验。为了避免剧透，短评尽量描述感受而不是情节。

## 推荐维度

- 画面与演出
- 音乐与声优表现
- 人物塑造
- 完成度与个人推荐指数`
    },
    {
      id: "night-photography",
      title: "城市夜景拍摄小记",
      category: "摄影",
      date: "2026-06-28",
      readTime: "5 分钟",
      accent: "amber",
      emoji: "📷",
      excerpt: "蓝调时刻、街头灯光和一点点等待，组成一张有呼吸感的夜景。",
      tags: ["摄影", "夜景", "城市"],
      content: `# 城市夜景拍摄小记

蓝调时刻通常出现在日落后不久。天空尚未全黑，建筑灯光已经亮起，冷暖对比最为自然。

## 我的拍摄习惯

1. 提前踩点，确认机位和回程路线
2. 保留高光细节，后期再适度提亮暗部
3. 等待人物或车辆进入画面，为城市增加尺度感`
    }
  ],

  projects: [
    { title: "你的代表项目", type: "Web / 2026", description: "填写项目解决的问题、你的职责和最值得介绍的成果。", url: "#", icon: "✦", color: "purple" },
    { title: "开源小工具", type: "Open Source", description: "放置 GitHub 项目、效率工具或有趣的实验作品。", url: "#", icon: "⌘", color: "blue" },
    { title: "创作作品集", type: "Creative", description: "可以是摄影、绘画、视频、音乐或其他个人创作。", url: "#", icon: "◈", color: "pink" }
  ],

  timeline: [
    { date: "现在", title: "建立个人博客", text: "开始系统整理知识、项目和生活记录。" },
    { date: "2026", title: "这里填写一个重要节点", text: "例如毕业、入职、发布作品或完成一次长途旅行。" },
    { date: "2025", title: "这里填写起点", text: "写下一个对你有意义的开始。" }
  ],

  friends: [
    { name: "朋友的博客", description: "一句话介绍这个有趣的灵魂。", url: "#", avatar: "友" },
    { name: "开源社区", description: "分享技术、知识与创造力。", url: "https://github.com", avatar: "源" },
    { name: "期待认识你", description: "交换友链请通过邮箱联系。", url: "mailto:you@example.com", avatar: "+" }
  ]
};
