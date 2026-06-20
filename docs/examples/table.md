# 表格（Table）

`type: 'table'` 是 NovaChart 的第 4 种图表类型，**与 Bar / Line / Pie 完全并列**。

> 💡 **重要特性**：`data` 可传入二维数组，自动渲染为多行表格，首列作行名。详见 [多行表格指南 ›](/guide/table-chart#-多行表格重要特性)

## 基础用法

```html
<div id="myTable"></div>

<script>
  new NovaChart('myTable', {
    type: 'table',
    title: '期末成绩',
    labels: ['语文', '数学', '英语', '物理', '化学'],
    data: [85, 92, 78, 88, 90],
    unit: '分',
    theme: 'ocean'
  }).draw();
</script>
```

<NovaChart :config="{ type: 'table', title: '期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90], unit: '分', theme: 'ocean' }" :show-code="true" />

## 学生相关案例

### 案例 1：成绩单

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

<NovaChart :config="{ type: 'table', title: '期末成绩单', labels: ['语文','数学','英语','物理','化学','生物'], data: [85,92,78,88,90,86], unit: '分', theme: 'ocean' }" />

### 案例 2：每日课程表

```js
new NovaChart('schedule', {
  type: 'table',
  title: '今日课程',
  labels: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节'],
  data: [8, 9, 10, 14, 15, 16],
  unit: '点',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '今日课程', labels: ['第1节','第2节','第3节','第4节','第5节','第6节'], data: [8,9,10,14,15,16], unit: '点', theme: 'sunset' }" />

### 案例 3：每月零花钱记录

```js
new NovaChart('money', {
  type: 'table',
  title: '本月零花钱收支',
  labels: ['收入', '饮食', '书籍', '娱乐', '交通', '结余'],
  data: [500, -150, -80, -50, -30, 190],
  unit: '元',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '本月零花钱收支', labels: ['收入','饮食','书籍','娱乐','交通','结余'], data: [500,-150,-80,-50,-30,190], unit: '元', theme: 'dark' }" />

### 案例 4：各科作业用时

```js
new NovaChart('homework', {
  type: 'table',
  title: '昨晚作业用时',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [45, 60, 30, 50, 40],
  unit: '分钟',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '昨晚作业用时', labels: ['语文','数学','英语','物理','化学'], data: [45,60,30,50,40], unit: '分钟', theme: 'sunset' }" />

### 案例 5：考试排名对比

```js
new NovaChart('rank', {
  type: 'table',
  title: '本次月考班级排名',
  labels: ['语文', '数学', '英语', '物理', '化学', '生物'],
  data: [5, 3, 12, 8, 6, 10],
  unit: '名',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '本次月考班级排名', labels: ['语文','数学','英语','物理','化学','生物'], data: [5,3,12,8,6,10], unit: '名', theme: 'ocean' }" />

### 案例 6：读书清单

```js
new NovaChart('books', {
  type: 'table',
  title: '本月读完的书籍',
  labels: ['三体', '活着', '围城', '平凡的世界', '追风筝的人'],
  data: [420, 240, 360, 480, 320],
  unit: '页',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '本月读完的书籍', labels: ['三体','活着','围城','平凡的世界','追风筝的人'], data: [420,240,360,480,320], unit: '页', theme: 'dark' }" />

### 案例 7：运动记录

```js
new NovaChart('sports', {
  type: 'table',
  title: '本周运动时长',
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [30, 0, 45, 30, 0, 60, 30],
  unit: '分钟',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '本周运动时长', labels: ['周一','周二','周三','周四','周五','周六','周日'], data: [30,0,45,30,0,60,30], unit: '分钟', theme: 'sunset' }" />

### 案例 8：考试错题统计

```js
new NovaChart('mistakes', {
  type: 'table',
  title: '数学错题统计',
  labels: ['计算错误', '概念不清', '审题错误', '时间不够'],
  data: [15, 25, 8, 12],
  unit: '题',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '数学错题统计', labels: ['计算错误','概念不清','审题错误','时间不够'], data: [15,25,8,12], unit: '题', theme: 'ocean' }" />

### 案例 9：作息时间表

```js
new NovaChart('routine', {
  type: 'table',
  title: '今日作息',
  labels: ['起床', '早餐', '午餐', '晚餐', '睡觉'],
  data: [7, 8, 12, 18, 22],
  unit: '点',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '今日作息', labels: ['起床','早餐','午餐','晚餐','睡觉'], data: [7,8,12,18,22], unit: '点', theme: 'sunset' }" />

### 案例 10：考试分数段人数

```js
new NovaChart('distribution', {
  type: 'table',
  title: '数学成绩分数段',
  labels: ['90+', '80-89', '70-79', '60-69', '<60'],
  data: [12, 18, 10, 5, 2],
  unit: '人',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '数学成绩分数段', labels: ['90+','80-89','70-79','60-69','<60'], data: [12,18,10,5,2], unit: '人', theme: 'dark' }" />

## ✨ 多行表格案例

`data` 传二维数组即可。子数组 `[0]` 作行名，`[1..]` 作该行数据。

### 案例 11：班级成绩对比（多行 · ocean）

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

<NovaChart :config="{ type: 'table', title: '班级前三名期末成绩', labels: ['语文','数学','英语','物理','化学'], data: [['张三',92,95,88,90,87],['李四',88,90,93,85,89],['王五',85,88,82,92,90]], unit: '分', theme: 'ocean' }" />

### 案例 12：最近三天作业用时（多行 · sunset）

```js
new NovaChart('recentHomework', {
  type: 'table',
  title: '最近三天作业用时',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [
    ['周一', 45, 60, 30, 50, 40],
    ['周二', 40, 55, 35, 45, 38],
    ['周三', 50, 65, 28, 55, 42]
  ],
  unit: '分钟',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'table', title: '最近三天作业用时', labels: ['语文','数学','英语','物理','化学'], data: [['周一',45,60,30,50,40],['周二',40,55,35,45,38],['周三',50,65,28,55,42]], unit: '分钟', theme: 'sunset' }" />

### 案例 13：月考前五名单科排名（多行 · dark + 霓虹色头）

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

<NovaChart :config="{ type: 'table', title: '月考前五名单科排名', labels: ['语文','数学','英语','物理','化学','生物'], data: [['同学A',1,3,5,2,4,6],['同学B',2,1,8,5,3,4],['同学C',5,2,1,8,6,7],['同学D',3,6,4,1,5,2],['同学E',7,4,3,6,2,1]], unit: '名', theme: 'dark' }" />

## 主题对比

| 主题 | 实际效果 |
|------|----------|
| `ocean` | 蓝色表头，白字，整洁专业 |
| `sunset` | 橙色表头，白字，温暖亲切 |
| `dark` | 霓虹色边框，深空背景，酷炫 |

## 响应式行为

### 宽屏（≥ 480px）

<NovaChart :config="{ type: 'table', labels: ['语文','数学','英语','物理','化学'], data: [85,92,78,88,90] }" />

### 窄屏（< 480px）

> 📱 缩小浏览器窗口到 480px 以下，表格自动转为卡片布局，每一格变成「标签 + 值」的结构。多行表格下，行头列依然左对齐 + 加底色，保证「身份不丢」。

## 为什么用 Table？

| 场景 | 推荐 |
|------|------|
| 精确数值展示 | ✅ Table |
| 需要打印 / 复制 | ✅ Table |
| 视觉对比 | ✅ Bar/Pie |
| 趋势变化 | ✅ Line |

## 下一步

- [柱状图 Bar](/examples/bar)
- [折线图 Line](/examples/line)
- [饼图 Pie](/examples/pie)