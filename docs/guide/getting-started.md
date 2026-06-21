# 快速开始

<iframe src="/examples/flasher.html" width="100%" height="260" frameborder="0" style="border-radius:8px;margin-bottom:24px"></iframe>

## 安装

### 方式 1：直接下载（推荐入门）

1. 下载两个文件：
   - `nova-chart.js`
   - `nova-chart.css`

2. 在 HTML 中引入：

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/nova-chart.css">
</head>
<body>
  <div id="myChart"></div>
  <script src="path/to/nova-chart.js"></script>
  <script>
    new NovaChart('myChart', {
      type: 'bar',
      title: '月考成绩',
      labels: ['语文', '数学', '英语'],
      data: [85, 92, 78],
      unit: '分'
    }).draw();
  </script>
</body>
</html>
```

### 方式 2：CDN（即将上线）

```html
<link rel="stylesheet" href="https://unpkg.com/nova-chart/dist/nova-chart.css">
<script src="https://unpkg.com/nova-chart/dist/nova-chart.js"></script>
```

### 方式 3：NPM（v1.1 计划）

```bash
npm install nova-chart
```

```js
import NovaChart from 'nova-chart';
import 'nova-chart/dist/nova-chart.css';
```

## 浏览器要求

NovaChart 支持现代浏览器：

- ✅ Chrome / Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ IE（不兼容，使用了 ES6+ 特性）

## 第一个图表

```html
<div id="chart" style="max-width: 600px;"></div>

<script>
  new NovaChart('chart', {
    type: 'bar',
    title: '本周学习时长',
    labels: ['周一', '周二', '周三', '周四', '周五'],
    data: [3, 4, 2, 5, 3],
    unit: '小时'
  }).draw();
</script>
```

<NovaChart :config="{ type: 'bar', title: '本周学习时长', labels: ['周一','周二','周三','周四','周五'], data: [3,4,2,5,3], unit: '小时' }" :show-code="true" />

应该看到一张带渐变色的柱状图，X 轴显示星期，Y 轴显示小时数。

## 4 种图表一览

NovaChart 支持 4 种图表，**API 完全一致**，只需改 `type` 字段。

### 📊 柱状图（Bar）

最适合**比较离散类别**之间的数量差异。

```js
new NovaChart('demo', {
  type: 'bar',
  title: '月考成绩',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [85, 92, 78, 88, 90],
  unit: '分'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '月考成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分' }" />

### 📈 折线图（Line）

最适合展示**连续变化趋势**。

```js
new NovaChart('demo', {
  type: 'line',
  title: '一学期数学成绩变化',
  labels: ['9月', '10月', '11月', '12月', '1月', '2月'],
  data: [78, 82, 85, 88, 90, 92],
  unit: '分'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '一学期数学成绩变化', labels: ['9月','10月','11月','12月','1月','2月'], data: [78,82,85,88,90,92], unit: '分' }" />

### 🥧 饼图（Pie）

最适合展示**部分与整体**的比例关系。

```js
new NovaChart('demo', {
  type: 'pie',
  title: '一天时间分配',
  labels: ['学习', '运动', '娱乐', '睡眠'],
  data: [8, 2, 4, 8],
  unit: '小时'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '一天时间分配', labels: ['学习','运动','娱乐','睡眠'], data: [8,2,4,8], unit: '小时' }" />

### 📋 数据表格（Table）

`type: 'table'` 是独立的第 4 种图表，**与 Bar / Line / Pie 完全并列**。

```js
new NovaChart('demo', {
  type: 'table',
  title: '期末成绩单',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [85, 92, 78, 88, 90],
  unit: '分'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '期末成绩单', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分' }" />

## 切换图表，只需改 `type`

| `type` | 适用场景 |
|--------|----------|
| `'bar'` | 离散类别对比 |
| `'line'` | 连续趋势 |
| `'pie'` | 比例构成 |
| `'table'` | 精确数值 / 打印 |

> 💡 **学一招通四招**：换 `type` 字段即可切换图表，其余配置完全相同。

## 下一步

- 阅读 [第一个图表](/guide/first-chart) 详细解释每个字段
- 查看 [分类示例](/examples/bar) 找灵感
- 看 [API 参考](/api/config) 查完整字段表