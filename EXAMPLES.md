# NovaChart.js — API 案例与设计

> 目标用户：Python 基础学生  
> 图表类型：Bar（柱状）/ Line（折线）/ Pie（饼）/ Table（表格）  
> 核心原则：**学一招通四招** —— 换 `type` 字段即可切换图表，其余配置完全相同

---

## 🎨 唯一 API：配置对象风格

### 完整字段

| 字段 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | ✅ | — | `'bar'` \| `'line'` \| `'pie'` \| `'table'` |
| `title` | ❌ | `''` | 图表标题 |
| `labels` | ✅ | — | 标签数组，如 `['苹果','香蕉']` |
| `data` | ✅ | — | 数值数组；`table` 可传入二维（二维时各行首列作行名，详见下文「数据表格」） |
| `unit` | ❌ | `''` | 单位，会拼到 tooltip 和数据表里 |
| `theme` | ❌ | `'ocean'` | `'ocean'` \| `'sunset'` \| `'dark'` |
| `showTable` | ❌ | `false` | 是否在画布下方显示数据表 |
| `animation` | ❌ | `'fade'` | `'fade'` \| `'slide'` \| `'none'` |
| `yPadding` | ❌ | `0.1` | `number`，Y 轴顶部留白比例（0–1） |

---

## 📘 基础案例

### 案例 1：柱状图（带数据表格）
```js
new NovaChart('myChart', {
  type: 'bar',
  title: '月销售额',
  labels: ['1月', '2月', '3月', '4月'],
  data: [120, 150, 170, 140],
  unit: '万元',
  theme: 'ocean',
  showTable: true,
  animation: 'fade'
}).draw();
```

### 案例 2：折线图
```js
new NovaChart('myChart', {
  type: 'line',
  title: '本周温度',
  labels: ['周一', '周二', '周三', '周四', '周五'],
  data: [22, 24, 19, 23, 25],
  unit: '°C',
  theme: 'sunset',
  animation: 'slide'
}).draw();
```

### 案例 3：饼图（暗色主题）
```js
new NovaChart('myChart', {
  type: 'pie',
  title: '时间分配',
  labels: ['学习', '运动', '娱乐', '睡眠'],
  data: [40, 15, 20, 25],
  unit: '%',
  theme: 'dark'
}).draw();
```

### 案例 4：表格（独立图表，无需 canvas）
```js
new NovaChart('myTable', {
  type: 'table',
  title: '月销售额',
  labels: ['1月', '2月', '3月', '4月'],
  data: [120, 150, 170, 140],
  unit: '万元',
  theme: 'sunset'
}).draw();
```

### 案例 4b：表格（二维自动识别）
`data` 为二维数组时自动渲染为多行表格——子数组的 `[0]` 作行名，`[1..]` 作该行数据。贴近 pandas DataFrame 风格。
```js
new NovaChart('myTable', {
  type: 'table',
  title: '期末成绩单',
  labels: ['语文', '数学', '英语', '物理'],
  data: [
    ['张三', 85, 92, 78, 88],
    ['李四', 75, 88, 82, 90],
    ['王五', 90, 80, 75, 85]
  ],
  unit: '分',
  theme: 'ocean'
}).draw();
```
> 💡 一维/二维不需要额外字段，自动识别。行名可以是字符串或数字。

### 案例 4c：表格（单行表头 + 单行数据，等价于案例 4）
```js
new NovaChart('myTable', {
  type: 'table',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30]
}).draw();
```

---

### 案例 5：极简版（只填 4 个字段）
```js
new NovaChart('myChart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30]
}).draw();  // 其余全部走默认
```

> 💡 **学生只要改 4 行**：`type` + `labels` + `data` + 可选 `title`，其他都不用管。

---

## 🌓 三套色卡主题

### Theme 1: `ocean`（海洋）— 默认，明亮清爽
| 主色 | 色值 |
|------|------|
| 🔵 蓝 | `#4A90E2` |
| 🟢 青 | `#50C9C3` |
| 🟠 橙 | `#F5A623` |
| 🟣 紫 | `#7B61FF` |
| 🔴 红 | `#FF6B6B` |

- 背景：`#FFFFFF`  文字：`#2C3E50`  网格：`#ECF0F1`

### Theme 2: `sunset`（日落）— 温暖活力
| 主色 | 色值 |
|------|------|
| 🔴 玫红 | `#FF6B6B` |
| 🟠 橙黄 | `#FFA94D` |
| 🟡 鲜黄 | `#FFD93D` |
| 🟢 草绿 | `#6BCB77` |
| 🔵 亮蓝 | `#4D96FF` |

- 背景：`#FFF9F0`  文字：`#333333`  网格：`#FFE8C7`

### Theme 3: `dark`（暗色）— 护眼酷炫
| 主色 | 色值 |
|------|------|
| 🔵 电青 | `#00D9FF` |
| 🟣 紫罗兰 | `#BD93F9` |
| 🟢 荧光绿 | `#50FA7B` |
| 🟠 琥珀 | `#FFB86C` |
| 🩷 粉 | `#FF79C6` |

- 背景：`#282A36`  文字：`#F8F8F2`  网格：`#44475A`

> 🎨 颜色按顺序循环使用：3 个标签用前 3 色，7 个标签用全部 5 色 + 重复。

---

## 📊 数据表格

本节讲清楚数据表格的一切：两种形态、字段含义、多行专属特性、误传回退、设计权衡。

### 两种形态一览

| 形态 | data 形状 | 适用图表 | 渲染结果 | 长度规则 |
|------|----------|---------|----------|----------|
| **单行** | `number[]` | `bar` / `line` / `pie` / `table` | 1 行表头 + 1 行数据 | `data.length === labels.length` |
| **多行** | `number[][]` | **`table` only** | 1 行表头 + M 行数据，首列作行名 | 每行 `row.length === labels.length + 1` |

> 形态由你传入的 `data` 决定，**不需要任何额外字段**，库自动识别。

### 多行表格字段含义

```
data: [
  ['行名1', 数值, 数值, 数值],   ← 第 1 行
  ['行名2', 数值, 数值, 数值],   ← 第 2 行
  ...
]
```

- `row[0]` — 这一行的名字（字符串或数字均可）
- `row[1..]` — 这一行各列的数值，顺序对应 `labels`

### ✨ 多行表格特性

| 特性 | 说明 |
|------|------|
| **行头列** | `row[0]` 单独成列，加粗、左对齐，与数据列视觉上明显区分 |
| **行头着色** | `dark` 主题下使用 palette 中的颜色（取 `palette[rowIdx % 5]`），每行不同色 |
| **行头光晕** | `dark` 主题下，行名带 `text-shadow: 0 0 4px ...66` 霓虹光晕 |
| **行头色条** | `dark` 主题下，行名 cell 左侧带 `2px solid ...88` 颜色边条，贴近色卡 |
| **行对齐** | 表头第一格为「行头占位」（空 `<th>`），保持列对齐一致 |
| **行斑马纹** | 隔行换底色（`theme.background` ↔ `theme.zebra`），多行也能明确区分行 |
| **列斑马纹** | `dark` 主题下数据 cell 上下边线为 `1px solid ...33`（不喧哗主色） |
| **响应式** | 窄屏（< 480px）下，行头列依然左对齐 + 加底色，保证「身份不丢」 |
| **长度容错** | 若某行 `length !== labels.length + 1`，控制台 `warn` 但不抛错（不阻挡渲染） |

### 通用特性（单行/多行均适用）

- 标题、表头用主题主色
- 斑马纹（隔行浅灰）
- 悬停高亮（鼠标所在行轻微变亮）
- 窄屏自适应堆叠
- 不需要学生会 HTML / CSS

实际渲染含主题色、斑马纹、悬停高亮、暗色光晕等视觉细节，打开 `demo/index.html` 即可看到完整效果。

### 误传回退

如果给 `bar` / `line` / `pie` 误传二维 `data`，库会在控制台 `warn` 并**自动取第一行**渲染，不会抛错阻塞。例如：
```js
new NovaChart('c', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [[1, 2, 3], [4, 5, 6]]   // 误传二维
}).draw();
// ⚠ NovaChart: bar 图不支持二维 data，已取第一行渲染
// → 实际渲染用的是 [1, 2, 3]
```

### 学生友好度

- ✅ 不引入新字段（如 `multiRow` / `rows` / `rowLabels`），保持 8 字段上限
- ✅ 一维 / 二维自动识别，零心智负担
- ✅ 多行表完全沿用 `labels` / `title` / `unit` / `theme`，无新概念
- ✅ 视觉上多一行加粗左对齐的「行头」列，暗色主题下额外带色条 + 光晕

### 启用表格的两种方式

| 方式 | 场景 | 代码 |
|------|------|------|
| `type: 'table'` | 独立表格图表 | `new NovaChart('t', { type:'table', ... })` |
| `showTable: true` | 在图下方追加表格 | `new NovaChart('c', { type:'bar', showTable:true, ... })` |

---

## 🔢 大数值场景

库**自动**检测数据范围并选最合适的中文 / 英文后缀缩放显示，不用新增任何字段。

### 中文量级（万 / 亿）

```js
// 百万级销售额
new NovaChart('sales', {
  type: 'bar',
  title: '月销售额',
  labels: ['1月', '2月', '3月', '4月'],
  data: [1500000, 2000000, 1800000, 2200000],
  unit: '元'
}).draw();
// Y 轴刻度：0, 50万, 100万, 150万, 200万
// 柱顶数值：150万元 / 200万元 / 180万元 / 220万元
```

### 中文亿级

```js
// 十亿级收入
new NovaChart('revenue', {
  type: 'line',
  title: '近五年营收',
  labels: ['2019', '2020', '2021', '2022', '2023'],
  data: [1200000000, 1500000000, 1800000000, 2200000000, 2600000000],
  unit: '元'
}).draw();
// Y 轴刻度：0, 5亿, 10亿, 15亿, 20亿, 25亿
```

### 英文量级（K / M / B）

```js
// YouTube 观看量
new NovaChart('views', {
  type: 'bar',
  title: 'Top 5 Videos',
  labels: ['A', 'B', 'C', 'D', 'E'],
  data: [1500, 25000, 350000, 4500000, 55000000],
  unit: 'views'
}).draw();
// Y 轴刻度：0, 10K, 1M, 10M
// 柱顶数值：1.5Kviews / 25Kviews / 350Kviews / 4.5Mviews / 55Mviews
```

### 缩放阈值总表

| 范围 | 后缀 | 除数 |
|------|------|------|
| < 1,000 | （无） | 1 |
| 1,000 – 9,999 | K | 10³ |
| 10,000 – 99,999,999 | 万 | 10⁴ |
| 1,000,000 – 999,999,999 | M | 10⁶ |
| 100,000,000+ | 亿 | 10⁸ |
| 1,000,000,000+ | B | 10⁹ |

### `yPadding` — Y 轴顶部留白

控制 niceMax 的额外留白，默认 0.1（10%）：

```js
{ type: 'bar', data: [100, 200, 150], yPadding: 0.3 }  // 留 30%
{ type: 'bar', data: [100, 200, 150], yPadding: 0 }    // 紧贴
{ type: 'bar', data: [100, 200, 150] }                   // 默认 0.1
```

### 不变原则

- 内部坐标计算仍用原始数值（柱子高度比例不变）
- 只改**显示文字**（Y 轴刻度 / 柱顶数值 / Table 单元格）
- 零新字段（`yPadding` 是唯一控制点，默认 0.1）

---

## ⚡ 反应式自动重绘（v0.3 新增）

> 这是上一版最常被问到的问题：「如果数据变了，怎么更新？」——答案是：**不用调任何方法，直接改 `config.data` 就会自动重绘**。

`config.data` 和 `config.labels` 底层是 **Proxy**，写入时自动触发重绘：

```js
const chart = new NovaChart('myChart', {
  type: 'bar',
  title: '期末成绩',
  labels: ['语文', '数学', '英语'],
  data: [85, 92, 78],
  unit: '分',
  animation: 'none'  // 实时数据场景用 'none' 避免闪烁
}).draw();

// ✅ 直接修改，自动重绘（无需 .update()）
chart.config.data[0] = 95;
chart.config.data.push(88);
chart.config.data = [70, 80, 90];          // 整体替换
chart.config.labels = ['甲', '乙', '丙'];
chart.config.theme = 'dark';
chart.config.title = '最新成绩';
```

### 案例 6：IoT 实时温度（setInterval）

```js
new NovaChart('temp', {
  type: 'line',
  title: '室内温度',
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  data: [22, 21, 23, 26, 28, 25],
  unit: '°C',
  animation: 'none'
}).draw();

setInterval(() => {
  const data = temp.config.data;
  data.shift();                            // 丢最老的
  data.push(20 + Math.random() * 10);      // 加最新的
}, 5000);
```

### 案例 7：点击按钮动态改数据

```html
<button onclick="myChart.config.data = myChart.config.data.map(v => v * 2)">
  全部 × 2
</button>
```

### 案例 8：主题切换器

```js
document.querySelector('#theme-toggle').onclick = () => {
  const themes = ['ocean', 'sunset', 'dark'];
  const cur = myChart.config.theme;
  const next = themes[(themes.indexOf(cur) + 1) % 3];
  myChart.config.theme = next;   // 自动重绘
};
```

### 案例 9：实时计数器

```js
new NovaChart('counter', {
  type: 'bar',
  labels: ['点击', '购买', '退订'],
  data: [0, 0, 0],
  unit: '人',
  animation: 'none'
}).draw();

// 10秒内随机推增
setInterval(() => {
  counter.config.data[0]++;
  if (Math.random() > 0.5) counter.config.data[1]++;
}, 100);
```

### 反应式机制说明

| 操作 | 是否触发重绘 |
|------|--------------|
| `chart.config.data = [...]` | ✅ |
| `chart.config.data.push(x)` | ✅ |
| `chart.config.data[i] = x` | ✅ |
| `chart.config.data.pop()` / `shift()` / `splice()` / `sort()` / `reverse()` | ✅ |
| `chart.config.labels = [...]` | ✅ |
| `chart.config.theme = 'dark'` | ✅ |
| `chart.config.title = 'X'` | ✅ |
| `chart.config.type = 'line'` | ✅ |
| `chart.config.data = chart.config.data`（同引用） | ❌（跳过） |
| `chart.config.data.forEach(...)` / `.map(...)` / `.filter(...)` | ❌（只读方法） |
| `chart.config.data` 销毁后再改 | ❌ |

**性能特性**：
- **microtask 去抖** —— 同一帧多次写入只重绘 1 次（如 IoT 轮询高频更新）
- **只拦截变更方法** —— 内部 render 用的 `forEach`/`map` 不会触发死循环
- **零运行时依赖** —— 用 ES6 Proxy，不引入第三方

> 💡 **常见问题**：之前用 `chart.update()` 的代码仍然兼容——只是多数场景不再需要。

---

## 🎬 动画（精简版）

| 值 | 效果 | 适用 |
|----|------|------|
| `'fade'` | 淡入 | 默认，三图皆宜 |
| `'slide'` | 从下/左滑入 | bar/line 更明显 |
| `'none'` | 无动画 | 大量数据时最快 |

> 砍掉：弹性、旋转、缩放、复杂 easing —— 学生用不上。

---

## ✅ 最终设计取舍

| 决策 | 选择 | 理由 |
|------|------|------|
| API 风格 | 只做配置对象 | 一致性 > 多花样 |
| 数据 | 单组 / table 多行 | 三图零负担；table 支持二维补齐多行场景 |
| 图表 | Bar / Line / Pie / Table | 覆盖 90% 学生场景 |
| 主题 | 3 套（1 暗色） | 兼顾美观与个性化 |
| 动画 | 3 种基础 | 视觉效果够用 |
| 表格 | 自动渲染 | 学生零 HTML 成本 |

---

## 📂 文件结构（产出）

- `nova-chart.js` — 主库（核心）
- `nova-chart.css` — 表格样式（独立引入）
- `EXAMPLES.md` — 本文档
- `demo/`
  - `index.html` — 四图 + 三主题 demo 页面