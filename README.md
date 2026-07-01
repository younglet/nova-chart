# 🌟 NovaChart.js

[![GitHub stars](https://img.shields.io/github/stars/younglet/nova-chart.svg)](https://github.com/younglet/nova-chart) [![Docs](https://img.shields.io/badge/Docs-nova-chart.app-blueviolet.svg)](https://younglet.github.io/nova-chart/) ![Size](https://img.shields.io/badge/Size-11KB_min-orange.svg)

> IoT 图表库。11KB min · 4 种图表（Bar / Line / Pie / Table）· 3 套主题。
> 给烧了 MicroPython 的 ESP32 当 HTTP server 时的前端三件套之一。
> 配套 [novajs](https://github.com/younglet/novajs) + [nova-style](https://github.com/younglet/nova-style) + [nova-ui](https://github.com/younglet/nova-ui)。
> 后端推荐 [**nova-server**](https://github.com/younglet/nova-server)（MicroPython 异步 Web 框架）。

## ✨ 特性

- 🎯 **8 个 API 字段** — 砍掉 Chart.js 30+ 字段中 95% 你用不上的
- 🎨 **3 套主题** — ocean / sunset / dark
- 📊 **4 种图表** — Bar / Line / Pie / Table 一致 API
- 🪶 **极轻量** — 主库仅 851 行（vs Chart.js 11589 行）
- 🇨🇳 **中文友好** — 标题、标签、单位直接写中文

## 🚀 一行代码画图

```html
<link rel="stylesheet" href="nova-chart.css">
<script src="nova-chart.js"></script>
<div id="myChart"></div>
<script>
  new NovaChart('myChart', {
    type: 'bar',
    title: '月考成绩',
    labels: ['语文', '数学', '英语', '物理', '化学'],
    data: [85, 92, 78, 88, 90],
    unit: '分',
    theme: 'ocean'
  }).draw();
</script>
```

## 📦 项目结构

- `SPEC.md` — 规格说明（设计圣经）
- `EXAMPLES.md` — API 文档
- `nova-chart.js` — 主库（628 行，18KB）
- `nova-chart.css` — 样式
- `README.md` — 本文件
- `usage/`
  - `index.novachart.html` — ESP32 部署模板
  - `demo/index.html` — 学生案例 demo（12 个）
- `docs/` — VitePress 官方站
  - `.vitepress/`
    - `config.mjs`
    - `theme/`
  - `index.md`
  - `guide/`
  - `api/`
  - `examples/`

## 🎬 启动文档站

```bash
npm install
npm run docs:dev    # 开发模式 http://localhost:5173
npm run docs:build  # 构建静态站
```

## 🌈 主题预览

| 主题 | 风格 | 主色 |
|------|------|------|
| `ocean` | 明亮清爽 | 蓝 / 青 / 橙 / 紫 / 红 |
| `sunset` | 温暖活力 | 玫红 / 橙黄 / 鲜黄 / 草绿 / 亮蓝 |
| `dark` | 赛博朋克 | 电光青 / 霓虹粉 / 毒液绿 / 烈焰橙 / 紫光 |

## 📊 vs Chart.js

| 维度 | Chart.js | NovaChart |
|------|----------|-----------|
| 源码行数 | 11589 | **628** |
| 打包体积 | ~200KB | **18KB** |
| API 字段 | 30+ | **8** |
| 学习成本 | 数小时 | **5 分钟** |

## 📜 License

powered by stemstar