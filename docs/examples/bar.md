# 柱状图（Bar）

柱状图最适合**比较离散类别**之间的数量差异。

## 基础用法

```html
<div id="chart"></div>

<script>
  new NovaChart('chart', {
    type: 'bar',
    title: '月考成绩',
    labels: ['语文', '数学', '英语', '物理', '化学'],
    data: [85, 92, 78, 88, 90],
    unit: '分',
    theme: 'ocean'
  }).draw();
</script>
```

<NovaChart :config="{ type: 'bar', title: '月考成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean' }" :show-code="true" />

## 学生相关案例

### 案例 1：各科成绩对比

```js
new NovaChart('scores', {
  type: 'bar',
  title: '期末各科成绩',
  labels: ['语文', '数学', '英语', '物理', '化学', '生物'],
  data: [85, 92, 78, 88, 90, 86],
  unit: '分',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '期末各科成绩', labels: ['语文','数学','英语','物理','化学','生物'], data: [85,92,78,88,90,86], unit: '分', theme: 'ocean' }" />

### 案例 2：每月零花钱

```js
new NovaChart('allowance', {
  type: 'bar',
  title: '每月零花钱',
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  data: [300, 280, 350, 320, 400, 380],
  unit: '元',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '每月零花钱', labels: ['1月','2月','3月','4月','5月','6月'], data: [300,280,350,320,400,380], unit: '元', theme: 'sunset' }" />

### 案例 3：各兴趣班报名人数

```js
new NovaChart('clubs', {
  type: 'bar',
  title: '兴趣班报名人数',
  labels: ['篮球', '钢琴', '绘画', '编程', '舞蹈', '书法'],
  data: [25, 18, 22, 30, 15, 12],
  unit: '人',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '兴趣班报名人数', labels: ['篮球','钢琴','绘画','编程','舞蹈','书法'], data: [25,18,22,30,15,12], unit: '人', theme: 'dark' }" />

### 案例 4：一周每天学习时长

```js
new NovaChart('study', {
  type: 'bar',
  title: '本周学习时长',
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [3, 4, 2, 5, 3, 6, 4],
  unit: '小时',
  animation: 'slide'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '本周学习时长', labels: ['周一','周二','周三','周四','周五','周六','周日'], data: [3,4,2,5,3,6,4], unit: '小时', animation: 'slide' }" />

### 案例 5：班级平均分对比

```js
new NovaChart('classes', {
  type: 'bar',
  title: '各班级数学平均分',
  labels: ['一班', '二班', '三班', '四班', '五班'],
  data: [82, 88, 85, 91, 87],
  unit: '分',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '各班级数学平均分', labels: ['一班','二班','三班','四班','五班'], data: [82,88,85,91,87], unit: '分', theme: 'sunset' }" />

### 案例 6：每日阅读页数

```js
new NovaChart('reading', {
  type: 'bar',
  title: '本周阅读页数',
  labels: ['周一', '周二', '周三', '周四', '周五'],
  data: [20, 35, 15, 40, 30],
  unit: '页',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '本周阅读页数', labels: ['周一','周二','周三','周四','周五'], data: [20,35,15,40,30], unit: '页', theme: 'ocean' }" />

### 案例 7：考试进步幅度

```js
new NovaChart('progress', {
  type: 'bar',
  title: '月考成绩提升',
  labels: ['语文', '数学', '英语', '物理'],
  data: [8, 12, 5, 10],
  unit: '分',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '月考成绩提升', labels: ['语文','数学','英语','物理'], data: [8,12,5,10], unit: '分', theme: 'dark' }" />

### 案例 8：运动打卡天数

```js
new NovaChart('exercise', {
  type: 'bar',
  title: '各运动项目本月打卡',
  labels: ['跑步', '跳绳', '游泳', '骑车', '瑜伽'],
  data: [12, 8, 4, 15, 10],
  unit: '天',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'bar', title: '各运动项目本月打卡', labels: ['跑步','跳绳','游泳','骑车','瑜伽'], data: [12,8,4,15,10], unit: '天', theme: 'sunset' }" />

## 主题对比

| 场景 | 推荐主题 |
|------|----------|
| 正式报告 / 作业 | `ocean` |
| 生活记录 / 心情 | `sunset` |
| 夜间模式 / 个性化 | `dark` |

## 动画建议

| 数据量 | 推荐动画 |
|--------|----------|
| ≤ 7 个标签 | `fade` 或 `slide` |
| 8+ 个标签 | `fade` 或 `none` |
| 实时刷新场景 | `none` |

## 下一步

- [折线图 Line](/examples/line)
- [饼图 Pie](/examples/pie)
- [表格 Table](/examples/table)