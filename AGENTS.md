# AGENTS.md — nova-chart

> AI 助手用的项目指南。

## 一句话

**nova-chart** 是 18KB 的极简图表库。4 种图表（Bar / Line / Pie / Table），3 套主题（ocean / sunset / dark）。

## 目标平台

和 novajs / nova-ui 配套：ESP32 + MicroPython 当 server，前端三件套 dump 到 flash 里渲染图表。

| 约束 | 体现 |
|---|---|
| 小 | 628 行 vs Chart.js 11589 行（1/18） |
| 简单 | 8 个 API 字段，4 种图表一致 |
| 中文友好 | 标题 / 标签 / 单位直接写中文 |
| 零学习 | Python 学生从 0 到画图 ≤ 5 分钟 |

**不是** Chart.js 替代品（功能少 95%），是给 IoT 场景的精简版。

## 跑通

```bash
cd nova-frontend/nova-chart
ls nova-chart.js nova-chart.css       # 主文件
```

没有 build step，没有测试（手动测）。直接用：

```html
<script src="nova-chart.js"></script>
<link rel="stylesheet" href="nova-chart.css">

<canvas id="c"></canvas>
<script>
  new NovaChart('c', {
    type: 'bar',
    title: '设备状态',
    data: { labels: ['在线', '离线'], values: [12, 3] }
  }).render()
</script>
```

## 关键文件

```
nova-chart/
├── AGENTS.md                       ← 你正在看的
├── nova-chart.js                   ← 628 行主代码
├── nova-chart.css                   ← 样式
├── SPEC.md                         ← 设计规格
├── EXAMPLES.md                     ← 例子速查
├── README.md
├── package.json
├── demo/                           ← 离线 demo
└── docs/                           ← VitePress 文档
```

## 核心约定

### 1. 4 种图表，1 个 API

```js
new NovaChart('canvas-id', {
  type: 'bar' | 'line' | 'pie' | 'table',
  title: '标题',
  data: {
    labels: ['A', 'B', 'C'],
    values: [10, 20, 30]
  },
  theme: 'ocean' | 'sunset' | 'dark'  // 可选
})
```

所有图表共用这一个构造函数，**没有 4 套 API**。

### 2. 主题

3 套主题，硬编码到 `nova-chart.css` 的 CSS 变量里：

```css
:root { --chart-color-1: #3b82f6; ... }    /* 默认 ocean */
.theme-sunset { --chart-color-1: #f97316; ... }
.theme-dark { --chart-color-1: #60a5fa; ... }
```

切换主题：`<html class="theme-dark">`。

### 3. 3 种动画

```js
animation: 'fade' | 'slide' | 'none'
```

默认 `'fade'`。IoT 场景建议 `'none'` 或 `'fade'`（避免频繁更新时闪烁）。

## 改动会影响什么

| 改这个 | 也会影响 |
|---|---|
| `nova-chart.js` | 所有图表渲染行为、API 兼容性 |
| `nova-chart.css` | 所有图表的视觉 |
| API 字段 | 所有使用图表的页面 |

## 提交前 checklist

打开 `demo/` 下的 HTML 文件看 4 种图表的渲染效果：
- Bar / Line / Pie 都能正常画
- Table 能渲染数据
- 切到 dark 主题也好

## 不要做的事

- ❌ 加图表类型（保持 4 种，IoT 用得到）
- ❌ 加动画库（保持简洁）
- ❌ 加插件系统（避免变成第二个 Chart.js）
- ❌ 加配置项（保持 8 个字段）