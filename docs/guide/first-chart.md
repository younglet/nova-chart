# 第一个图表

让我们用 5 分钟拆解一个完整示例。

## 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="nova-chart.css">
  <title>我的第一个图表</title>
</head>
<body>
  <div id="scores" style="max-width: 600px;"></div>

  <script src="nova-chart.js"></script>
  <script>
    new NovaChart('scores', {
      type: 'bar',           // ← 图表类型
      title: '月考成绩',     // ← 标题
      labels: ['语文', '数学', '英语', '物理', '化学'],
      data: [85, 92, 78, 88, 90],
      unit: '分',             // ← 单位
      theme: 'ocean',         // ← 主题
      animation: 'fade'       // ← 动画
    }).draw();
  </script>
</body>
</html>
```

## 实际运行效果

<NovaChart :config="{ type: 'bar', title: '月考成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean', animation: 'fade' }" :show-code="true" />

## 逐字段解释

### `type` — 图表类型（必填）

控制画什么图。可选值：

| 值 | 说明 | 演示 |
|----|------|------|
| `'bar'` | 柱状图（默认） | <NovaChart :config="{ type: 'bar', labels: ['语文','数学','英语'], data: [85,92,78] }" /> |
| `'line'` | 折线图 | <NovaChart :config="{ type: 'line', labels: ['周一','周二','周三'], data: [22,24,19] }" /> |
| `'pie'` | 饼图 | <NovaChart :config="{ type: 'pie', labels: ['学习','运动','娱乐'], data: [8,2,4] }" /> |
| `'table'` | 数据表格 | <NovaChart :config="{ type: 'table', labels: ['语文','数学','英语'], data: [85,92,78] }" /> |

### `title` — 标题（可选）

显示在图表顶部的中文/英文文字。

```js
title: '月考成绩'         // 显示：月考成绩
title: 'Math Scores'      // 显示：Math Scores
title: ''                 // 不显示
```

### `labels` — 标签数组（必填）

X 轴 / 扇区的文字标签。**数组长度必须等于 `data` 长度**。

```js
labels: ['语文', '数学', '英语']
labels: ['Jan', 'Feb', 'Mar']
labels: ['苹果', '香蕉', '橙子']
```

### `data` — 数据数组（必填）

数值数组，与 `labels` 一一对应。

```js
data: [85, 92, 78]
data: [120, 150, 170, 140]
data: [40, 15, 20, 25]
```

### `unit` — 单位（可选）

会拼到每个数值的后面（Tooltip、表格、数据标签）。

```js
unit: '分'        // 显示：85分
unit: '°C'        // 显示：22°C
unit: '万元'      // 显示：120万元
```

### `theme` — 主题（可选，默认 `'ocean'`）

| 值 | 风格 |
|----|------|
| `'ocean'` | 明亮清爽（默认） |
| `'sunset'` | 温暖活力 |
| `'dark'` | 赛博朋克霓虹 |

### `animation` — 动画（可选，默认 `'fade'`）

| 值 | 效果 |
|----|------|
| `'fade'` | 淡入 |
| `'slide'` | 从下滑入 |
| `'none'` | 无动画 |

### `.draw()` — 启动渲染

最后必须调用 `.draw()`，否则图表不会画出来。

```js
new NovaChart('id', {...}).draw();   // ✅ 正确
new NovaChart('id', {...});          // ❌ 不会渲染
```

## 练习时间 ✏️

打开浏览器开发者工具，试试改下面的字段：

```js
new NovaChart('scores', {
  type: 'bar',                    // 改成 'line' 或 'pie' 或 'table'
  title: '月考成绩',
  labels: ['语文', '数学', '英语'],
  data: [85, 92, 78],
  unit: '分',
  theme: 'ocean'                  // 改成 'sunset' 或 'dark'
}).draw();
```

> 💡 改一个字段，按 F5 刷新，看变化。

## 下一步

- [三套主题](/guide/themes) — 主题色如何影响全图
- [基础动画](/guide/animations) — 三种动画效果对比
- [API 完整字段](/api/config) — 查漏补缺