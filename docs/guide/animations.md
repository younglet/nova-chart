# 基础动画

NovaChart 砍掉了 Chart.js 的复杂动画引擎，只保留 3 种最实用的：

## 三种动画对比

| 动画 | 效果 | 适用 | 时长 |
|------|------|------|------|
| `'fade'` | 整体淡入 | 四图皆宜（默认） | 400ms |
| `'slide'` | 从下滑入 | Bar / Line | 500ms |
| `'none'` | 无动画 | 大量数据 / 性能优先 | 0ms |

## `fade` — 淡入（默认）

整个图表容器从透明到不透明。

```js
new NovaChart('chart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30],
  animation: 'fade'   // 默认值，写不写都行
}).draw();
```

**适用**：所有场景，最稳妥的选择。

## `slide` — 滑入

图表从下方 15px 处滑入并淡入。

```js
new NovaChart('chart', {
  type: 'line',
  labels: ['周一', '周二', '周三'],
  data: [3, 5, 4],
  animation: 'slide'
}).draw();
```

**适用**：柱状图、折线图（视觉冲击感更强）。**Pie 和 Table 用 slide 效果不明显**。

## `none` — 无动画

立即显示，无任何过渡。

```js
new NovaChart('chart', {
  type: 'bar',
  labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  animation: 'none'   // 数据多时建议关闭
}).draw();
```

**适用**：
- 数据点 ≥ 20 个时
- 批量渲染多个图表时
- 用户系统设置了 `prefers-reduced-motion` 时（v1.1 计划自动适配）

## 缓动函数

所有动画使用 **ease-out cubic** 缓动：

```
t: 0.0 → 0.16 → 0.42 → 0.74 → 1.0
ease(t): 0 → 0.42 → 0.79 → 0.96 → 1.0
```

视觉效果：**开始快，结尾慢**，符合直觉。

## 性能建议

```js
// ❌ 不推荐：100 个图表都用动画
charts.forEach(cfg => new NovaChart(cfg.id, {...cfg, animation: 'fade'}).draw());

// ✅ 推荐：批量时关闭动画
charts.forEach(cfg => new NovaChart(cfg.id, {...cfg, animation: 'none'}).draw());
```

## 自定义动画时长？（v1 不支持）

当前版本不支持自定义时长。如需修改：

- 直接编辑 `nova-chart.js` 第 432 行附近的 `const duration = anim === 'fade' ? 400 : 500;`

## 下一步

- [表格图表](/guide/table-chart) — 第 4 种图表类型