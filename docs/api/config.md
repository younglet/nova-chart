# config 字段参考

`new NovaChart(id, config)` 的第二个参数。

## 完整字段表

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| [`type`](#type) | `string` | ✅ | `'bar'` | 图表类型 |
| [`title`](#title) | `string` | ❌ | `''` | 标题 |
| [`labels`](#labels) | `string[]` | ✅ | — | 标签数组 |
| [`data`](#data) | `number[]` \| `number[][]` | ✅ | — | 数值数组；`table` 可传入二维（首列作行名） |
| [`unit`](#unit) | `string` | ❌ | `''` | 单位 |
| [`theme`](#theme) | `string` | ❌ | `'ocean'` | 主题名 |
| [`animation`](#animation) | `string` | ❌ | `'fade'` | 入场动画 |

---

## `type`

**类型**：`'bar' | 'line' | 'pie' | 'table'`
**必填**：✅

```js
{ type: 'bar' }     // 柱状图
{ type: 'line' }    // 折线图
{ type: 'pie' }     // 饼图
{ type: 'table' }   // 表格
```

**无效值处理**：自动回退到 `'bar'` 并在控制台 warn。

---

## `title`

**类型**：`string`
**必填**：❌  **默认**：`''`

图表顶部标题。

```js
{ title: '月考成绩' }      // 中文
{ title: 'Math Scores' }   // 英文
{ title: '' }              // 不显示
```

---

## `labels`

**类型**：`string[]`
**必填**：✅

X 轴标签 / 扇区标签。

```js
{ labels: ['语文', '数学', '英语'] }
{ labels: ['苹果', '香蕉', '橙子'] }
{ labels: ['1月', '2月', '3月', '4月'] }
```

**规则**：
- 长度应等于 `data.length`
- 长度不一致时，控制台 warn，但不会崩溃

---

## `data`

**类型**：`number[] | number[][]`
**必填**：✅

`bar` / `line` / `pie` 只能传一维；`table` 可以传一维或二维（多行表格）。库会根据维度自动识别渲染。

### 一维 `number[]`（单行）

数值数组，与 `labels` 一一对应。**所有图表都支持**。

```js
{ data: [85, 92, 78] }
{ data: [120, 150, 170, 140] }
{ data: [40, 15, 20, 25] }     // Pie 用，比例自动计算
```

**长度规则**：`data.length === labels.length`

### 二维 `number[][]`（多行表格，**仅 `table` 支持**）

子数组的 `[0]` 作行名，`[1..]` 作该行数据，贴近 pandas `DataFrame` 风格：

```js
{
  labels: ['语文', '数学', '英语', '物理'],
  data: [
    ['张三', 85, 92, 78, 88],   // row[0]=行名, row[1..]=数据
    ['李四', 75, 88, 82, 90],
    ['王五', 90, 80, 75, 85]
  ]
}
```

**长度规则**：每行 `row.length === labels.length + 1`

**其他图表误传二维**：不会拋错，控制台 warn 并自动取第一行：

```js
{ type: 'bar', labels: ['A','B','C'], data: [[1,2,3],[4,5,6]] }
// ⚠ NovaChart: bar 图不支持二维 data，已取第一行渲染
// → 实际渲染 [1, 2, 3]
```

> 完整多行表格特性详见 [数据表格指南 › 多行表格](/guide/table-chart#-多行表格重要特性)

---

## `unit`

**类型**：`string`
**必填**：❌  **默认**：`''`

会拼到所有数值的后面：tooltip、表格、数据标签。

```js
{ unit: '分' }       // 显示：85分
{ unit: '°C' }       // 显示：22°C
{ unit: '万元' }     // 显示：120万元
{ unit: '%' }        // 显示：40%
```

---

## `theme`

**类型**：`'ocean' | 'sunset' | 'dark'`
**必填**：❌  **默认**：`'ocean'`

```js
{ theme: 'ocean' }   // 海洋（明亮）
{ theme: 'sunset' }  // 日落（暖色）
{ theme: 'dark' }    // 赛博朋克（暗色 + 霓虹）
```

**无效值处理**：自动回退到 `'ocean'` 并在控制台 warn。

---

## `animation`

**类型**：`'fade' | 'slide' | 'none'`
**必填**：❌  **默认**：`'fade'`

```js
{ animation: 'fade' }   // 淡入（默认）
{ animation: 'slide' }  // 下滑
{ animation: 'none' }   // 无动画
```

**提示**：Pie / Table 用 `slide` 效果不明显。

---

## `yPadding`

**类型**：`number`（0–1）
**必填**：❌  **默认**：`0.1`（留 10%）

控制 **Y 轴顶部留白**。仅对 `bar` / `line` 生效。

库会取最大值，nice 到 1/2/5/10 整数倍后乘以 `(1 + yPadding)`：

```js
{ yPadding: 0.1 }   // 默认 10%（推荐）
{ yPadding: 0 }     // 紧贴数据
{ yPadding: 0.3 }   // 留 30% 空白
{ yPadding: 0.5 }   // 留 50% 空白
```

同时触发 [大数值自动缩放](/guide/auto-scale) 阈值检测：

| 数据范围 | 后缀 | 例 |
|----------|------|----|
| < 1,000 | （无） | `850元` |
| 1,000–9,999 | K | `1.5Kviews` |
| 10,000–99,999,999 | 万 | `150万元` |
| 1,000,000–999,999,999 | M | `1.5Mviews` |
| 100,000,000+ | 亿 | `15亿元` |
| 1,000,000,000+ | B | `1.5Bviews` |

详细阈值表与示例详见 [🔢 大数值场景](/guide/auto-scale)。

---

## 完整示例

```js
new NovaChart('myChart', {
  type: 'bar',                // 必填
  title: '月考成绩',          // 可选
  labels: ['语文', '数学', '英语', '物理', '化学'],  // 必填
  data: [85, 92, 78, 88, 90], // 必填
  unit: '分',                  // 可选
  theme: 'ocean',              // 可选，默认 ocean
  animation: 'fade'            // 可选，默认 fade
}).draw();
```

## 极简版本（4 个字段）

```js
new NovaChart('myChart', {
  type: 'bar',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30]
}).draw();
```

> 其余 5 个字段全部走默认值。

## 错误处理

| 情况 | 行为 |
|------|------|
| `type` 无效 | warn + 回退到 `'bar'` |
| `theme` 无效 | warn + 回退到 `'ocean'` |
| `labels` / `data` 长度不等 | warn，不阻塞渲染 |
| `table` 的某行长度不等于 `labels.length + 1` | warn，不阻塞渲染 |
| `labels` / `data` 不是数组 | throw 异常 |
| `bar` / `line` / `pie` 误传二维 `data` | warn + 自动取第一行 |
| 找不到目标元素 | throw 异常 |

## 下一步

- [NovaChart 类](/api/class) — 了解实例方法
- [示例库](/examples/bar) — 实战代码