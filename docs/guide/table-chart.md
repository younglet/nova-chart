# 表格图表（Table）

`type: 'table'` 是 NovaChart 的第 4 种图表类型，与 Bar / Line / Pie **完全并列**。

## ✨ 多行表格（重要特性）

> 只需把 `data` 从一维数组换成**二维数组**，库自动渲染成多行表格。不用新增字段，不用记规则。

### 现场对比

**单行表格**（`data: number[]`）— 一个学生、一门成绩：

<NovaChart :config="{ type: 'table', title: '期末成绩（单行）', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean' }" />

**多行表格**（`data: number[][]`）— 多个学生、多个成绩：

<NovaChart :config="{ type: 'table', title: '班级前三名期末成绩（多行）', labels: ['语文','数学','英语','物理','化学'], data: [['张三',92,95,88,90,87],['李四',88,90,93,85,89],['王五',85,88,82,92,90]], unit: '分', theme: 'ocean' }" />

### 数据形态总表

| 形态 | data 形状 | 适用图表 | 渲染结果 | 长度规则 |
|------|----------|---------|----------|----------|
| **单行** | `number[]` | `bar` / `line` / `pie` / `table` | 1 行表头 + 1 行数据 | `data.length === labels.length` |
| **多行** | `number[][]` | **`table` only** | 1 行表头 + M 行数据，首列作行名 | 每行 `row.length === labels.length + 1` |

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

### 误传回退

给 `bar` / `line` / `pie` 误传二维 `data` 时，库不会崩溃：

```js
new NovaChart('c', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [[1, 2, 3], [4, 5, 6]]   // 误传二维
}).draw();
// ⚠ NovaChart: bar 图不支持二维 data，已取第一行渲染
// → 实际渲染用的是 [1, 2, 3]
```

> 心态安全：怎么传都不拋错，要么取第一行，要么按多行渲染。

## 它是什么？

一张主题色联动的响应式 HTML 表格，**不需要 canvas**，直接渲染 DOM。

```js
new NovaChart('myTable', {
  type: 'table',
  title: '期末成绩',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [85, 92, 78, 88, 90],
  unit: '分',
  theme: 'ocean'
}).draw();
```

### 实际渲染效果

<NovaChart :config="{ type: 'table', title: '期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean' }" :show-code="true" />

## 为什么把 Table 算作图表？

1. **数据展示的另一种形态**：有时候表格比图表更清晰（精确数值）
2. **API 一致性**：学生学一招通四招
3. **响应式开箱即用**：窄屏自动转卡片布局
4. **可打印**：CSS 优化过打印效果

## 主题联动效果

主题切换会影响表格的视觉表现。下方是同一个表格在三种主题下的实际渲染对比：

### `ocean`（默认）

<NovaChart :config="{ type: 'table', title: '期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean' }" />

### `sunset`

<NovaChart :config="{ type: 'table', title: '期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'sunset' }" />

### `dark`（赛博朋克）

<NovaChart :config="{ type: 'table', title: '期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'dark' }" />

| 主题 | 表头样式 |
|------|----------|
| `ocean` | 蓝色实心背景，白字 |
| `sunset` | 橙色实心背景，白字 |
| `dark` | 各列用霓虹色，透明背景 + 发光边框 |

## 响应式行为

NovaChart 内置响应式 CSS，**无需写一行代码**。

### 宽屏（≥ 480px）

正常表格布局，每列等宽：

<NovaChart :config="{ type: 'table', labels: ['语文','数学','英语','物理','化学','生物'], data: [85,92,78,88,90,86], unit: '分' }" />

### 窄屏（< 480px）

浏览器窗口拉窄到 480px 以下，自动转为卡片布局：每一行变成一张「卡片」，行名 + 数据堆叠展示。多行表格下，行头列依然左对齐 + 加底色，保证「身份不丢」。

> 📱 缩小浏览器窗口亲自试试！

## 动画

Table 只支持 `fade` 动画（`slide` 和 `none` 对它效果不明显）。

```js
new NovaChart('myTable', {
  type: 'table',
  labels: [...],
  data: [...],
  animation: 'fade'   // 推荐
}).draw();
```

## 生成的 DOM 结构

调用 `new NovaChart(id, { type: 'table', ... }).draw()` 后，库会在容器内插入以下 HTML：

```html
<div class="nova-chart nova-table nova-theme-ocean"
     data-theme="ocean"
     style="background-color: #FFFFFF;">

  <!-- 标题（暗色主题会带霓虹光带） -->
  <div class="nova-title"
       style="color: #2C3E50;">
    期末成绩（分）
  </div>

  <!-- 表格本体 -->
  <table class="nova-table-el">
    <thead>
      <tr>
        <th style="background-color: #4A90E2; color: #FFFFFF;">语文</th>
        <th style="background-color: #4A90E2; color: #FFFFFF;">数学</th>
        <th style="background-color: #4A90E2; color: #FFFFFF;">英语</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background-color: #FFFFFF; color: #2C3E50;">85</td>
        <td style="background-color: #F8FAFC; color: #2C3E50;">92</td>
        <td style="background-color: #FFFFFF; color: #2C3E50;">78</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 暗色主题生成的 DOM

当 `theme: 'dark'` 时，标题会自带霓虹光带背景：

```html
<div class="nova-chart nova-table nova-theme-dark"
     data-theme="dark"
     style="background-color: #0A0A14;">

  <div class="nova-title" style="
      color: #00F5FF;
      background: linear-gradient(90deg, #00F5FF33, transparent);
      border-left: 3px solid #00F5FF;
      padding-left: 12px;
      text-shadow: 0 0 8px #00F5FF99;
      letter-spacing: 1px;">
    期末成绩（分）
  </div>

  <table class="nova-table-el">
    <thead>
      <tr>
        <th style="background-color: #00F5FF22; color: #00F5FF; border-bottom: 2px solid #00F5FF;">
          语文
        </th>
        <th style="background-color: #FF00E522; color: #FF00E5; border-bottom: 2px solid #FF00E5;">
          数学
        </th>
        <!-- ... -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background-color: #0A0A14; color: #E0E0FF; border-left: 1px solid #00F5FF33; border-right: 1px solid #00F5FF33;">85</td>
        <!-- ... -->
      </tr>
    </tbody>
  </table>
</div>
```

### 你能用它做什么？

了解 DOM 结构后，你可以：

- ✅ 用 CSS 覆盖 `nova-title` / `nova-table-el` 改样式
- ✅ 用 JS 查询 DOM 提取数据（`document.querySelector('.nova-table-el')`）
- ✅ 在表格渲染后调用 `print()` 直接打印
- ✅ 用浏览器 devtools 调试颜色
- ✅ 添加自定义事件监听

```js
// 渲染后访问 DOM
const chart = new NovaChart('myTable', { type: 'table', ... }).draw();
const table = document.querySelector('#myTable .nova-table-el');
console.log(table.querySelectorAll('td').length);  // 数据点数量
```

### 多行表格生成的 DOM

当 `data` 为二维时，额外生成「行头占位 + 行头列」结构：

```html
<table class="nova-table-el">
  <thead>
    <tr>
      <th class="nova-table-row-head" style="background-color: #00F5FF22;"></th>
      <th style="color: #00F5FF; border-bottom: 2px solid #00F5FF;">语文</th>
      <th style="color: #FF00E5; border-bottom: 2px solid #FF00E5;">数学</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="nova-table-row-head"
          style="font-weight: 600; color: #00F5FF;
                 border-left: 2px solid #00F5FF88;
                 text-shadow: 0 0 4px #00F5FF66;">张三</td>
      <td>85</td>
      <td>92</td>
    </tr>
    <tr>
      <td class="nova-table-row-head"
          style="color: #FF00E5; border-left: 2px solid #FF00E588;
                 text-shadow: 0 0 4px #FF00E566;">李四</td>
      <td>75</td>
      <td>88</td>
    </tr>
  </tbody>
</table>
```

> 多行表格的 row head 都有 `.nova-table-row-head` class，方便 CSS 覆盖。

## 实战场景

### 场景 1：成绩单

<NovaChart :config="{ type: 'table', title: '期末成绩单', labels: ['语文','数学','英语','物理','化学','生物'], data: [85,92,78,88,90,86], unit: '分', theme: 'ocean' }" />

```js
new NovaChart('grades', {
  type: 'table',
  title: '期末成绩单',
  labels: ['语文', '数学', '英语', '物理', '化学', '生物'],
  data: [85, 92, 78, 88, 90, 86],
  unit: '分',
  theme: 'ocean'
}).draw();
```

### 场景 1b：多行 — 班级成绩对比（多行表格）

<NovaChart :config="{ type: 'table', title: '班级前三名期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [['张三',92,95,88,90,87],['李四',88,90,93,85,89],['王五',85,88,82,92,90]], unit: '分', theme: 'ocean' }" />

```js
new NovaChart('classRanks', {
  type: 'table',
  title: '班级前三名期末成绩',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [
    ['张三', 92, 95, 88, 90, 87],
    ['李四', 88, 90, 93, 85, 89],
    ['王五', 85, 88, 82, 92, 90]
  ],
  unit: '分',
  theme: 'ocean'
}).draw();
```

### 场景 1c：多行 — 暗色主题多行（霓虹色头）

<NovaChart :config="{ type: 'table', title: '月考前五名单科排名', labels: ['语文','数学','英语','物理','化学','生物'], data: [['同学A',1,3,5,2,4,6],['同学B',2,1,8,5,3,4],['同学C',5,2,1,8,6,7],['同学D',3,6,4,1,5,2],['同学E',7,4,3,6,2,1]], unit: '名', theme: 'dark' }" />

```js
new NovaChart('top5', {
  type: 'table',
  title: '月考前五名单科排名',
  labels: ['语文', '数学', '英语', '物理', '化学', '生物'],
  data: [
    ['同学A', 1, 3, 5, 2, 4, 6],
    ['同学B', 2, 1, 8, 5, 3, 4],
    ['同学C', 5, 2, 1, 8, 6, 7],
    ['同学D', 3, 6, 4, 1, 5, 2],
    ['同学E', 7, 4, 3, 6, 2, 1]
  ],
  unit: '名',
  theme: 'dark'
}).draw();
```

### 场景 2：动态切换不同班级数据

```js
function showClass(className) {
  new NovaChart('classData', {
    type: 'table',
    title: className + ' 成绩',
    labels: ['语文', '数学', '英语'],
    data: getScores(className),
    unit: '分',
    theme: 'sunset'
  }).draw();
}
```

<NovaChart :config="{ type: 'table', title: '一班 成绩', labels: ['语文','数学','英语','物理'], data: [85,92,78,88], unit: '分', theme: 'sunset' }" />

### 场景 3：服务器监控（暗色 + 实时刷新）

<NovaChart :config="{ type: 'table', title: '服务器状态', labels: ['CPU','内存','磁盘','网络'], data: [45,60,30,80], unit: '%', theme: 'dark' }" />

```js
function refresh() {
  new NovaChart('monitor', {
    type: 'table',
    title: '服务器状态',
    labels: ['CPU', '内存', '磁盘', '网络'],
    data: [45, 60, 30, 80],
    unit: '%',
    theme: 'dark'
  }).draw();
}
setInterval(refresh, 5000);
```

### 场景 4：考试错题统计

<NovaChart :config="{ type: 'table', title: '数学错题统计', labels: ['计算错误','概念不清','审题错误','时间不够'], data: [15,25,8,12], unit: '题', theme: 'ocean' }" />

## 下一步

- [API 完整字段](/api/config)
- [Table 示例](/examples/table)