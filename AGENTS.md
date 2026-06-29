# AGENTS.md — nova-chart

> AI 助手用的项目指南。

## 一句话

**nova-chart** 是 12KB 的极简图表库。4 种图表（Bar / Line / Pie / Table），3 套主题（`ocean` / `sunset` / `dark`）。

## 目标平台

和 novajs / nova-ui 配套：ESP32 + MicroPython 当 server，前端三件套 dump 到 flash 里渲染图表。

| 约束 | 体现 |
|---|---|
| 小 | 单文件 ~12KB JS + 1.5KB CSS |
| 简单 | 8 个 API 字段，4 种图表一致 |
| 中文友好 | 标题 / 标签 / 单位直接写中文 |
| 零学习 | Python 学生从 0 到画图 ≤ 5 分钟 |

**不是** Chart.js 替代品（功能少 95%），是给 IoT 场景的精简版。

## 跑通

```bash
cd nova-frontend/nova-chart
npm install             # terser + csso + vitepress
npm run build           # src/nova-chart.js → min
npm run docs:dev        # 起 docs 站点（5176 端口）
```

**没有**自动化测试，靠 demo 手动看。改动后用 `demo/` 和 `docs/` 里的 chart 验证渲染。

## 关键文件

```
nova-chart/
├── AGENTS.md                       ← 你正在看的
├── SPEC.md                         ← 设计规格
├── EXAMPLES.md                     ← 例子速查
├── README.md
├── package.json                    ← build / sync / docs:dev / docs:build
├── Dockerfile
├── src/
│   ├── nova-chart.js               ← 核心
│   ├── nova-chart.min.js
│   ├── nova-chart.css
│   └── nova-chart.min.css
├── scripts/
│   ├── esp32-serial.js             ← Web Serial 写文件到 ESP32
│   └── sync-public.js              ← 把 src / usage / usage/index.novachart.html / usage/demo 同步到 docs/public/
├── (index.novachart.html 已移入 usage/)            ← ESP32 /static/ 入口 HTML
├── usage/                          ← 案例与部署模板目录
│   ├── index.novachart.html       ← ESP32 /static/ 入口 HTML
│   └── demo/index.html             ← 12 个学生案例 demo
└── docs/                           ← VitePress 文档
    └── public/demo/index.html       ← 离线 demo（VitePress 访问 demo/）
    └── .vitepress/
        ├── config.mjs              ← sidebar + nav 生态下拉
        └── theme/
            ├── index.js            ← 注册 NovaChart + Esp32Flasher
            ├── custom.css
            └── components/
                ├── NovaChart.vue   ← 文档里嵌入图表的 Vue 组件
                └── Esp32Flasher.vue ← Web Serial 一键烧录
```

## 核心约定

### 1. 4 种图表，1 个 API

```js
new NovaChart('canvas-id', {
  type: 'bar' | 'line' | 'pie' | 'table',
  title: '标题',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30],
  unit: '分',          // 可选
  theme: 'ocean' | 'sunset' | 'dark'  // 可选，默认 'ocean'
})
```

所有图表共用这一个构造函数，**没有 4 套 API**。

### 2. 3 套主题

| 主题 | 风格 | 5 色 |
|---|---|---|
| `ocean` | 浅底冷色 | 蓝 / 青 / 橙 / 紫 / 红 |
| `sunset` | 浅底暖色 | 红 / 橙 / 黄 / 绿 / 蓝 |
| `dark` | 暗色（低饱和 + 描边 + 不发光的灰） | 青 / 绿 / 橙 / 粉 / 紫 |

`dark` 主题的色板（`src/nova-chart.js` 的 `THEMES.dark`）：

```js
dark: {
  background: '#282A36',  // 暗色背景
  text:       '#F8F8F2',  // 暗色前景
  grid:       '#44475A',  // 当前行
  tableHead:  '#44475A',
  zebra:      '#343746',
  palette:    ['#8BE9FD', '#50FA7B', '#FFB86C', '#FF79C6', '#BD93F9']
  // 不设 glow: true — 所有 shadowBlur 走普通 stroke
}
```

表格行头用 2px 左边框（取调色板第 `rowIdx` 色）替代原发光描边。

### 3. 3 种动画

```js
animation: 'fade' | 'slide' | 'none'
```

默认 `'fade'`。IoT 场景建议 `'none'` 或 `'fade'`（避免频繁更新时闪烁）。

## 改动会影响什么

| 改这个 | 也会影响 |
|---|---|
| `src/nova-chart.js` | 所有图表渲染行为、API 兼容性、4 个图表类 |
| 主题色板 | `dark` 主题的所有视觉（表格、柱状、折线、饼图、标签颜色） |
| `src/nova-chart.css` | 表格默认样式 |
| API 字段 | 所有使用图表的页面 |

## 提交前 checklist

```bash
npm run build          # terser + csso 不报错
npm run docs:build     # VitePress 构建过
```

打开 `docs/public/demo/index.html`（VitePress 走 `http://localhost:5176/demo/`）在浏览器看 4 种图表的渲染效果：
- Bar / Line / Pie 都能正常画
- Table 能渲染数据
- 切到 `theme: 'dark'` 也好看（低饱和、零 shadowBlur）

`docs/.vitepress/theme/components/NovaChart.vue` 用来在 markdown 里嵌入图表：

```md
<NovaChart :config="{ type: 'line', title: '...', labels: [...], data: [...] }" />
```

## 不要做的事

- ❌ 加图表类型（保持 4 种，IoT 用得到）
- ❌ 加动画库（保持简洁）
- ❌ 加插件系统（避免变成第二个 Chart.js）
- ❌ 加配置项（保持 8 个字段）
- ❌ 改 `dark` 主题配色（已定稿）
- ❌ 加回 `shadowBlur` 发光效果（违反"克制"原则）
- ❌ 在 `<nova-*> ...</nova-*>` 直接用于 .md（SSR 崩），用 `<iframe src="/examples/...">` 嵌入
