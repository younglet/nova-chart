# NovaChart 类

## 构造函数

```ts
new NovaChart(target: string | HTMLElement, config: NovaConfig)
```

| 参数 | 说明 |
|------|------|
| `target` | 目标容器的 ID（字符串）或 DOM 元素 |
| `config` | 配置对象，详见 [config 字段](/api/config) |

**示例**：

```js
// 用 ID
new NovaChart('myChart', { ... }).draw();

// 用 DOM 元素
const el = document.getElementById('myChart');
new NovaChart(el, { ... }).draw();
```

## 实例方法

### `.draw()`

启动渲染。**必须调用**，否则图表不显示。

```js
const chart = new NovaChart('myChart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30]
});
chart.draw();   // ✅ 现在图表渲染了
```

**返回值**：`this`（支持链式）

```js
new NovaChart('myChart', {...}).draw().update({...});   // 也合法
```

---

### `.update(newConfig?)`

局部更新配置或重新渲染。

```js
const chart = new NovaChart('myChart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30],
  theme: 'ocean'
}).draw();

// 改数据
chart.update({ data: [50, 60, 70] });

// 改主题
chart.update({ theme: 'dark' });

// 同时改多个
chart.update({
  data: [100, 200, 300],
  theme: 'sunset'
});
```

**特性**：
- 不传参数：仅重新渲染（不改变 config）
- 部分字段更新：未指定的字段保持原值
- 自动校验新 config

**返回值**：`this`

---

### `.destroy()`

销毁图表实例，清理 DOM 和动画。

```js
const chart = new NovaChart('myChart', {...}).draw();

// 不用了，销毁
chart.destroy();
```

**效果**：
- 清空容器内容
- 取消正在进行的动画
- 标记实例为已销毁（后续 `.draw()` / `.update()` 不再生效）

**返回值**：`this`

---

## 静态属性

### `NovaChart.version`

```js
console.log(NovaChart.version);   // '0.1'
```

### `NovaChart.themes`

```js
console.log(Object.keys(NovaChart.themes));
// ['ocean', 'sunset', 'dark']

console.log(NovaChart.themes.dark.palette);
// ['#00F5FF', '#FF00E5', '#39FF14', '#FF6700', '#BD00FF']
```

## 完整示例

```html
<div id="chart"></div>
<button onclick="chart.update({data:[99,99,99]})">更新</button>
<button onclick="chart.destroy()">销毁</button>

<script>
  const chart = new NovaChart('chart', {
    type: 'bar',
    title: '考试分数',
    labels: ['语文', '数学', '英语'],
    data: [85, 92, 78],
    unit: '分',
    theme: 'ocean'
  }).draw();
</script>
```

## 生命周期图

```
new NovaChart(id, config)   ← 配置校验，保存状态
       ↓
   .draw()                   ← 渲染到 DOM，触发动画
       ↓
   .update(newConfig?)       ← 局部更新
       ↓
   .destroy()                ← 清理
```

## 下一步

- [分类示例](/examples/bar) — 实战代码
- [config 字段](/api/config) — 查漏补缺