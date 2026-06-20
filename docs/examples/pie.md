# 饼图（Pie）

饼图最适合展示**部分与整体**的比例关系。

## 基础用法

```html
<div id="chart"></div>

<script>
  new NovaChart('chart', {
    type: 'pie',
    title: '时间分配',
    labels: ['学习', '运动', '娱乐', '睡眠'],
    data: [40, 15, 20, 25],
    unit: '%',
    theme: 'ocean'
  }).draw();
</script>
```

<NovaChart :config="{ type: 'pie', title: '时间分配', labels: ['学习','运动','娱乐','睡眠'], data: [40,15,20,25], unit: '%', theme: 'ocean' }" :show-code="true" />

## 学生相关案例

### 案例 1：一天时间分配

```js
new NovaChart('time', {
  type: 'pie',
  title: '一天 24 小时分配',
  labels: ['学习', '运动', '娱乐', '睡眠', '其他'],
  data: [8, 2, 4, 8, 2],
  unit: '小时',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '一天 24 小时分配', labels: ['学习','运动','娱乐','睡眠','其他'], data: [8,2,4,8,2], unit: '小时', theme: 'ocean' }" />

### 案例 2：成绩等级分布

```js
new NovaChart('grades', {
  type: 'pie',
  title: '全班数学成绩分布',
  labels: ['优秀(90+)', '良好(80-89)', '中等(70-79)', '及格(60-69)', '不及格'],
  data: [12, 18, 10, 5, 2],
  unit: '人',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '全班数学成绩分布', labels: ['优秀(90+)','良好(80-89)','中等(70-79)','及格(60-69)','不及格'], data: [12,18,10,5,2], unit: '人', theme: 'sunset' }" />

### 案例 3：兴趣班报名比例

```js
new NovaChart('clubs', {
  type: 'pie',
  title: '兴趣班报名比例',
  labels: ['篮球', '钢琴', '绘画', '编程', '舞蹈'],
  data: [25, 18, 22, 30, 15],
  unit: '人',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '兴趣班报名比例', labels: ['篮球','钢琴','绘画','编程','舞蹈'], data: [25,18,22,30,15], unit: '人', theme: 'dark' }" />

### 案例 4：零花钱用途

```js
new NovaChart('allowance', {
  type: 'pie',
  title: '本月零花钱用途',
  labels: ['饮食', '书籍', '娱乐', '交通', '其他'],
  data: [120, 80, 50, 30, 20],
  unit: '元',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '本月零花钱用途', labels: ['饮食','书籍','娱乐','交通','其他'], data: [120,80,50,30,20], unit: '元', theme: 'sunset' }" />

### 案例 5：阅读类型分布

```js
new NovaChart('reading', {
  type: 'pie',
  title: '本月阅读类型分布',
  labels: ['文学', '科普', '历史', '技术', '其他'],
  data: [40, 25, 15, 30, 10],
  unit: '%',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '本月阅读类型分布', labels: ['文学','科普','历史','技术','其他'], data: [40,25,15,30,10], unit: '%', theme: 'ocean' }" />

### 案例 6：考试错题类型

```js
new NovaChart('mistakes', {
  type: 'pie',
  title: '数学错题类型',
  labels: ['计算错误', '概念不清', '审题错误', '时间不够'],
  data: [15, 25, 8, 12],
  unit: '题',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '数学错题类型', labels: ['计算错误','概念不清','审题错误','时间不够'], data: [15,25,8,12], unit: '题', theme: 'dark' }" />

### 案例 7：出行方式

```js
new NovaChart('commute', {
  type: 'pie',
  title: '上学出行方式',
  labels: ['步行', '自行车', '公交', '家长送', '其他'],
  data: [10, 15, 20, 30, 5],
  unit: '人',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '上学出行方式', labels: ['步行','自行车','公交','家长送','其他'], data: [10,15,20,30,5], unit: '人', theme: 'sunset' }" />

### 案例 8：睡眠时间分布

```js
new NovaChart('sleep', {
  type: 'pie',
  title: '本周睡眠时长分布',
  labels: ['<6小时', '6-7小时', '7-8小时', '8-9小时', '>9小时'],
  data: [1, 2, 3, 1, 0],
  unit: '天',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'pie', title: '本周睡眠时长分布', labels: ['<6小时','6-7小时','7-8小时','8-9小时','>9小时'], data: [1,2,3,1,0], unit: '天', theme: 'dark' }" />

## 数据规则

饼图**自动计算百分比**，不需要你自己算：

```js
// data: [40, 15, 20, 25]
// total = 100
// 第一块扇形 = 40%
// 第二块扇形 = 15%
// 以此类推
```

也可以用绝对数值：

```js
data: [12, 18, 10, 5, 2]   // 饼图自动算比例
```

## 视觉元素

饼图包含：

- **彩色扇形**：按 data 顺序对应主题色
- **引导线**：从扇形连到外侧标签
- **百分比标签**：自动计算，如 `学习 40.0%`
- **背景色**：主题背景
- **暗色主题**：扇形带霓虹光晕

## 最佳实践

| ✅ 推荐 | ❌ 不推荐 |
|---------|----------|
| 3-6 个类别 | 超过 8 个类别（太碎） |
| 数值有差异 | 数值相近（视觉难分） |
| 突出最大块 | 数据全部相等 |
| 部分与整体 | 离散数据对比（用 Bar） |

## Pie vs Bar 选择

| 场景 | 推荐 |
|------|------|
| 部分占整体的比例 | `pie` |
| 类别之间数量对比 | `bar` |
| 强调"占比"概念 | `pie` |
| 强调"差异"概念 | `bar` |

## 下一步

- [柱状图 Bar](/examples/bar)
- [折线图 Line](/examples/line)
- [表格 Table](/examples/table)