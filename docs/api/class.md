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

> 💡 **大多数场景不再需要 `.update()`** —— 直接改 `chart.config.data` 也会自动重绘（见下方「反应式」）。`.update()` 主要用于一次性批量替换配置或只想触发一次重绘的场景。

---

### ⚡ 反应式自动重绘（v0.3 新增）

`config.data` / `config.labels` 底层是 **Proxy**，写入时**自动触发重绘**，无需手动调 `update()`：

```js
const chart = new NovaChart('myChart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30]
}).draw();

// ✅ 全部自动重绘
chart.config.data.push(40);                    // 数组方法
chart.config.data[0] = 999;                    // 索引赋值
chart.config.data = [50, 60, 70];              // 整体替换
chart.config.labels = ['甲', '乙', '丙'];      // labels 改
chart.config.theme = 'dark';                   // 主题切换
chart.config.title = '实时温度';               // 标题改
chart.config.type = 'line';                    // 图表类型切换

// ✅ 反向引用也保留响应
const arr = chart.config.data;
arr.push(99);    // chart.config.data 同步更新，图表重绘
```

**机制**：
- **microtask 去抖**：同一帧连续多次写入只重绘 1 次（如 IoT 轮询）
- **变更方法触发**：push / pop / shift / unshift / splice / sort / reverse / fill / copyWithin
- **只读方法不触发**：forEach / map / filter / slice（避免 render 内部循环触发）
- **相同值跳过**：`chart.config.data = chart.config.data` 不会重绘
- **destroy 后停止**：销毁后再改 data 不再触发

**典型场景**：

```js
// IoT 传感器轮询
setInterval(() => {
  chart.config.data = readSensor();   // 直接赋值，自动重绘
}, 1000);

// 实时计数器
setInterval(() => {
  chart.config.data[0]++;
}, 16);

// 主题切换器
document.querySelector('#theme-toggle').onclick = () => {
  chart.config.theme = chart.config.theme === 'ocean' ? 'dark' : 'ocean';
};
```

> ⚠️ **二维 table 内层 row 的修改不会触发顶层重绘**（性能考虑）。如需改内层，用外层 `.data = [...]` 整体替换。

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
new NovaChart(id, config)   ← 配置校验，包成反应式 Proxy
       ↓
   .draw()                   ← 渲染到 DOM，触发动画（仅一次）
       ↓
   chart.config.data = …     ← 自动重绘（无需 update）
       ↓
   .update(newConfig?)       ← 批量替换配置（可选，仍兼容）
       ↓
   .destroy()                ← 清理
```

## 下一步

- [分类示例](/examples/bar) — 实战代码
- [config 字段](/api/config) — 查漏补缺