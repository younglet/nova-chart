---
layout: home

hero:
  name: NovaChart
  text: 极简图表，学一招通四招
  tagline: 为 Python 基础学生打造的轻量图表库 — 4 种图表、3 套主题、零学习成本、表格自动识别一维/二维
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/bar
  image:
    src: /nova-chart-logo.svg
    alt: NovaChart

features:
  - icon: 🎯
    title: 一致即简洁
    details: Bar / Line / Pie / Table 共用同一套 API。换 type 字段即可切换图表，学会一个会四个。
  - icon: 🎨
    title: 三套主题
    details: ocean / sunset / dark（含赛博朋克霓虹风格）。主题色自动应用到图表、网格、表格、Tooltip。
  - icon: 📊
    title: 表格也是图表
    details: Table 作为第 4 种图表类型独立存在，不需要 canvas，主题色联动，可直接打印。
  - icon: 🪟
    title: '多行表格（重要特性）'
    details: "`data` 为二维数组时自动渲染多行表格，首列作行名，贴近 pandas DataFrame 风格。不用新增字段，不用记规则。"
  - icon: 🪶
    title: 极轻量
    details: 主库仅 628 行（vs Chart.js 11589 行），18KB，无任何运行时依赖，浏览器原生运行。
  - icon: 🇨🇳
    title: 中文友好
    details: 标题、标签、单位直接写中文，无需转义。API 命名贴合 matplotlib / pandas 习惯。
  - icon: 🎬
    title: 基础动画
    details: fade / slide / none 三种动画，ease-out 缓动，专注核心视觉效果。
---

## 一行代码画图

```js
new NovaChart('myChart', {
  type: 'bar',
  title: '月考成绩',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [85, 92, 78, 88, 90],
  unit: '分',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '月考成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', animation: 'slide' }" :show-code="true" />

## 为什么选择 NovaChart？

相比 Chart.js、ECharts 等"全能型"图表库，NovaChart 做了一件事：**砍掉 95% 你用不上的功能，留下最直观的 5%**。

| 维度 | Chart.js | NovaChart |
|------|----------|-----------|
| 代码量 | 11589 行 | **628 行** |
| API 字段 | 30+ | **8** |
| 学习曲线 | 陡 | **平** |
| 主题 | 自定义 | **3 套开箱** |
| 适合谁 | 前端开发者 | **Python 基础学生** |

> 🎓 如果你会 `plt.bar(x, y)`，那你 5 分钟就能学会 NovaChart。