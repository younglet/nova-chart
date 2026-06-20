# 折线图（Line）

折线图最适合展示**连续变化趋势**。

## 基础用法

```html
<div id="chart"></div>

<script>
  new NovaChart('chart', {
    type: 'line',
    title: '本周温度',
    labels: ['周一', '周二', '周三', '周四', '周五'],
    data: [22, 24, 19, 23, 25],
    unit: '°C',
    theme: 'ocean'
  }).draw();
</script>
```

<NovaChart :config="{ type: 'line', title: '本周温度', labels: ['周一','周二','周三','周四','周五'], data: [22,24,19,23,25], unit: '°C', theme: 'ocean' }" :show-code="true" />

## 学生相关案例

### 案例 1：一学期成绩变化

```js
new NovaChart('grades', {
  type: 'line',
  title: '一学期数学成绩变化',
  labels: ['9月', '10月', '11月', '12月', '1月', '2月'],
  data: [78, 82, 85, 88, 90, 92],
  unit: '分',
  theme: 'ocean',
  animation: 'slide'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '一学期数学成绩变化', labels: ['9月','10月','11月','12月','1月','2月'], data: [78,82,85,88,90,92], unit: '分', theme: 'ocean', animation: 'slide' }" />

### 案例 2：每日学习时长

```js
new NovaChart('study', {
  type: 'line',
  title: '本月每日学习时长',
  labels: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
  data: [3, 4, 2, 5, 3, 6, 4],
  unit: '小时',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '本月每日学习时长', labels: ['1日','5日','10日','15日','20日','25日','30日'], data: [3,4,2,5,3,6,4], unit: '小时', theme: 'sunset' }" />

### 案例 3：每日步数

```js
new NovaChart('steps', {
  type: 'line',
  title: '本周每日步数',
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [8000, 12000, 6500, 10500, 9000, 15000, 7500],
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '本周每日步数', labels: ['周一','周二','周三','周四','周五','周六','周日'], data: [8000,12000,6500,10500,9000,15000,7500], theme: 'dark' }" />

### 案例 4：模拟考试成绩趋势

```js
new NovaChart('mock', {
  type: 'line',
  title: '高三模考成绩',
  labels: ['一模', '二模', '三模', '四模', '五模', '六模', '高考'],
  data: [520, 545, 560, 580, 595, 610, 625],
  unit: '分',
  theme: 'ocean'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '高三模考成绩', labels: ['一模','二模','三模','四模','五模','六模','高考'], data: [520,545,560,580,595,610,625], unit: '分', theme: 'ocean' }" />

### 案例 5：体重变化

```js
new NovaChart('weight', {
  type: 'line',
  title: '本月体重变化',
  labels: ['第1周', '第2周', '第3周', '第4周'],
  data: [65, 64.5, 64, 63.5],
  unit: 'kg',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '本月体重变化', labels: ['第1周','第2周','第3周','第4周'], data: [65,64.5,64,63.5], unit: 'kg', theme: 'sunset' }" />

### 案例 6：单词背诵量累计

```js
new NovaChart('vocab', {
  type: 'line',
  title: '单词背诵量',
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [50, 100, 150, 220, 280, 350, 400],
  unit: '个',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '单词背诵量', labels: ['周一','周二','周三','周四','周五','周六','周日'], data: [50,100,150,220,280,350,400], unit: '个', theme: 'dark' }" />

### 案例 7：每月生活费支出

```js
new NovaChart('spending', {
  type: 'line',
  title: '每月生活费支出',
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  data: [1200, 1500, 1300, 1400, 1600, 1450],
  unit: '元',
  theme: 'sunset'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '每月生活费支出', labels: ['1月','2月','3月','4月','5月','6月'], data: [1200,1500,1300,1400,1600,1450], unit: '元', theme: 'sunset' }" />

### 案例 8：做题正确率

```js
new NovaChart('accuracy', {
  type: 'line',
  title: '数学题正确率',
  labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
  data: [70, 75, 78, 82, 85, 88],
  unit: '%',
  theme: 'dark'
}).draw();
```

<NovaChart :config="{ type: 'line', title: '数学题正确率', labels: ['第1周','第2周','第3周','第4周','第5周','第6周'], data: [70,75,78,82,85,88], unit: '%', theme: 'dark' }" />

## Bar vs Line 选择

| 场景 | 推荐图表 |
|------|----------|
| 比较离散类别 | `bar` |
| 展示连续趋势 | `line` |
| 数据点 ≥ 10 个 | `line`（更清晰） |
| 强调单点数值 | `bar` |
| 强调变化速率 | `line` |

## 视觉差异

| 元素 | Bar | Line |
|------|-----|------|
| 主体 | 矩形柱 | 连线 + 数据点 |
| 数据点 | 顶部数值 | 圆点 + 数值 |
| 下方 | 无填充 | 半透明渐变填充 |
| 适用 | 离散对比 | 连续趋势 |

## 下一步

- [柱状图 Bar](/examples/bar)
- [饼图 Pie](/examples/pie)
- [表格 Table](/examples/table)