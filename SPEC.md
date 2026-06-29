# NovaChart.js — 项目规格说明书 (SPEC)

> **版本**：v0.2  
> **状态**：活跃  
> **基于**：Chart.js v4.5.0  
> **目标**：为 Python 基础学生打造"开箱即用、零学习负担"的图表库

---

## 0. 目标平台

nova-chart 是 **nova-frontend** 系列的一部分。整套系列设计为给烧了 **MicroPython 的 ESP32** 当 HTTP server 时使用：

| 项目 | 职责 | min 后大小 |
|---|---|---|
| novajs | 反应式内核 | 13 KB |
| nova-style | 原子 CSS | 11 KB |
| nova-ui | 静态 + 动态组件 | 18 KB CSS + 21 KB JS |
| **nova-chart** | **图表** | **12 KB JS + 1.5 KB CSS** |

ESP32 flash 4MB，整套 ~76 KB 装得下，手机连 WiFi 即可访问。

设计约束：

- **小** — ~12 KB min vs Chart.js 11589 行（1/18）
- **快** — 一次绘制 ≤ 16ms
- **IoT 友好** — 传感器数据可视化、轮询更新、3 套主题
- **零依赖** — 单文件，可直接放 flash

---

## 1. 项目背景

### 1.1 为什么做
Chart.js 功能强大但 API 复杂，11589 行 bundled 代码，对学生过度工程化。学生痛点：
- 数据集/坐标轴/插件三层嵌套结构
- 多图表类型 API 形态不一致
- 大量用不上的高级特性（雷达/极坐标/对数/时间轴）
- 没有"傻瓜式"的数据表格输出

### 1.2 目标用户
- **主**：Python 基础学生（会 `matplotlib` / `pandas` 简单用法）
- **次**：前端初学者、不愿读长文档的快速原型开发者

### 1.3 成功标准
| 指标 | 目标 |
|------|------|
| 学生从 0 到画出第一张图 | ≤ 5 分钟 |
| API 字段数 | ≤ 9 个 |
| 四种图表 API 形态 | 100% 一致 |
| 代码行数 | ≤ 3500 行（vs 原版 11589） |
| 视觉与 Chart.js 差异 | ≤ 10%（保持熟悉感） |

---

## 2. 范围

### 2.1 ✅ In Scope（必须做）
- **4 种图表**：Bar / Line / Pie / **Table**（表格与其他并列）
- **2 种坐标轴**：Category（分类）/ Linear（线性）
- **3 套主题**：`ocean` / `sunset` / `dark`
- **3 种基础动画**：`fade` / `slide' | 'none`
- **Canvas 渲染**：bar/line/pie 用 canvas
- **响应式**：自适应父容器宽度

### 2.2 ❌ Out of Scope（明确不做）
- 其他图表：Bubble / Scatter / Radar / PolarArea / Doughnut
- 其他坐标轴：Logarithmic / Time / RadialLinear
- 多数据集（`datasets: [{...}, {...}]`）
- 交互：缩放、拖拽、平移、十字准星
- 插件：Subtitle / Colors / Decimation / Filler
- TypeScript 类型定义（v1）
- 服务端渲染（SSR）
- 导出 PNG/SVG
- 国际化 i18n 框架

### 2.3 🔪 砍掉但保留扩展点
- Tree-shaking 注册机制（统一内置）
- 复杂动画引擎（保留 Animator 骨架即可）
- TypeScript decorator 风格（保留普通 class）

---

## 3. API 规格

### 3.1 顶层签名
```ts
class NovaChart {
  constructor(canvasId: string, config: NovaConfig): void
  draw(): NovaChart              // 链式
  update(newConfig?: Partial<NovaConfig>): void  // 局部刷新
  destroy(): void
}
```

### 3.2 完整字段表

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `type` | `'bar' \| 'line' \| 'pie' \| 'table'` | ✅ | — | 图表类型 |
| `title` | `string` | ❌ | `''` | 标题，显示在顶部 |
| `labels` | `string[]` | ✅ | — | X 轴 / 扇区标签 |
| `data` | `number[]` \| `number[][]` | ✅ | — | 单组与 labels 等长；二维时仅 `table` 有效，首列元素作行名 |
| `unit` | `string` | ❌ | `''` | 单位，拼到 tooltip 和数据表 |
| `theme` | `'ocean' \| 'sunset' \| 'dark'` | ❌ | `'ocean'` | 主题名 |
| `showTable` | `boolean` | ❌ | `false` | 是否渲染数据表 |
| `animation` | `'fade' \| 'slide' \| 'none'` | ❌ | `'fade'` | 入场动画 |
| `yPadding` | `number` | ❌ | `0.1` | Y 轴顶部留白比例（0–1），同时控制自动缩放阈值 |

### 3.3 错误处理
```js
// 输入校验，抛清晰错误
new NovaChart('my', {
  type: 'bar',
  labels: ['A'],
  data: [10]
}).draw();

// 错误示例（运行时控制台 warn，不阻塞）：
// ⚠ NovaChart: labels 和 data 长度不一致
// ⚠ NovaChart: type 'xxx' 不支持，已回退到 'bar'
```

### 3.4 API 不变性原则
- ✅ 四图 `labels` + `data` 同形（基线形态）
- ✅ 四图 `title` / `unit` / `theme` 同形
- ✅ `type: 'table'` 是独立图表，不附属于其他
- ✅ `table` 自动识别 `data` 一维 / 二维：二维时首列作行名（pandas 风格）
- ❌ 不引入"图表专属"字段（如 `barWidth` / `lineTension`）

---

## 4. 视觉规格

### 4.1 三套主题

#### Theme: `ocean`（默认）
```
主色板（按顺序取用）：
  #4A90E2  蓝
  #50C9C3  青
  #F5A623  橙
  #7B61FF  紫
  #FF6B6B  红

背景: #FFFFFF    文字: #2C3E50    网格: #ECF0F1
表格头: #4A90E2  斑马纹: #F8FAFC
```

#### Theme: `sunset`
```
主色板：
  #FF6B6B  玫红
  #FFA94D  橙黄
  #FFD93D  鲜黄
  #6BCB77  草绿
  #4D96FF  亮蓝

背景: #FFF9F0    文字: #333333    网格: #FFE8C7
表格头: #FFA94D  斑马纹: #FFF3E0
```

#### Theme: `dark`（低饱和暗色）

> “克制”原则：低饱和 + 描边 + 不发光的灰。参照业界成熟暗色方案取值，不亮瞎眼、不阴间。

```
主色板（5 个数据色）：
  #8BE9FD  青
  #50FA7B  绿
  #FFB86C  橙
  #FF79C6  粉
  #BD93F9  紫

背景:   #282A36
文字:   #F8F8F2
网格:   #44475A
表格头: #44475A
斑马纹: #343746   比背景略亮
文字装饰: 不发光，0 shadowBlur；行头 2px 左边框取主色板中的一个
```

**v0.1 → v0.2 改动**：
- 背景 `#0A0A14`（深空黑）→ `#282A36`（更柔）
- 文字 `#E0E0FF`（冷光白）→ `#F8F8F2`（中性白）
- 调色板：去除高饱和电光 / 霓虹（`#00F5FF` / `#FF00E5` / `#39FF14` / `#FF6700` / `#BD00FF`）
- 去掉 `glow: true` 字段，所有 `shadowBlur` 不再触发
- 柱状/折线/饼图发光轮廓 / 外环发光 / 标题 textShadow / 表格 textShadow：全部去除
- 表头硬编码 `#FFFFFF` → `theme.text`（`#F8F8F2`）

### 4.2 视觉与 Chart.js 的差异（≤10%）
- 保留：字号、留白、圆角、tooltip 形态
- 简化：去掉阴影、去掉渐变（v1 不做）
- 微调：标题字号略大（16px → 18px），更醒目

### 4.3 字体
- 全部 sans-serif，系统默认栈（避免引入字体文件）
- 标题：18px / 700
- 坐标轴：12px / 400
- Tooltip：13px / 500

### 4.4 标题样式（所有主题都有底色）

所有主题的 `.nova-title` 都有视觉标识，不靠 `text-align: center` 凭中文字重区分：

| 主题 | 背景透明度 | 文字颜色 | 附加效果 |
|------|----------|---------|---------|
| `ocean` | 8%（`14`） | `theme.text` | — |
| `sunset` | 8%（`14`） | `theme.text` | — |
| `dark` | 20%（`33`） | 主题色 | `text-shadow: 0 0 8px 主题色99` + `letter-spacing: 1px` |

**统一元素**：
- 背景：`linear-gradient(90deg, 主题色透明度, transparent)` 渐变
- 左边框：`3px solid 主题色`
- 左右内边距：12px

### 4.5 大数值自动缩放

为避免柱顶数字「1,500,000」挤在一起、Y 轴刻度 6 位数堆在左侧，库**自动**检测数据范围并选最合适的中文 / 英文后缀缩放显示。

#### 缩放阈值表

| 数据范围 | 中文后缀 | 英文后缀 | 除数 |
|----------|----------|----------|------|
| < 1,000 | （无） | （无） | 1 |
| 1,000 – 9,999 | — | K | 10³ |
| 10,000 – 99,999,999 | 万 | — | 10⁴ |
| 1,000,000 – 999,999,999 | — | M | 10⁶ |
| 100,000,000+ | 亿 | — | 10⁸ |
| 1,000,000,000+ | — | B | 10⁹ |

中文场景（`unit: '元'` / `'元'` ）优先走中文量级；英文场景（`unit: 'views'`）走 K/M/B。

#### 示例

```js
// 百万级销售额
{ type: 'bar', data: [1500000, 2000000, 1800000, 2200000], unit: '元' }
// Y 轴刻度：0, 50万, 100万, 150万, 200万
// 柱顶数值：150万元 / 200万元 / 180万元 / 220万元

// 十亿级收入
{ type: 'line', data: [1500000000, 2000000000], unit: '元' }
// Y 轴刻度：0, 5亿, 10亿, 15亿, 20亿
// 数据点：15亿元 / 20亿元

// 英文 K
{ type: 'bar', data: [1500, 2500, 3500], unit: 'views' }
// Y 轴刻度：0, 1K, 2K, 3K
// 柱顶数值：1.5Kviews / 2.5Kviews / 3.5Kviews
```

#### 精度策略

| 缩放后数值范围 | 小数位数 | 例 |
|---------------|---------|------|
| ≥ 100 | 0 | 150万元 |
| 10 – 99 | 1 | 15.5万元 |
| 1 – 9 | 2 | 1.55万元 |
| < 1 | 3 | 0.155万 |

#### `yPadding` 参数

- 默认 `0.1`（10%），Y 轴顶部预留 10% 空白
- 范围 0–1
- `0` = 紧贴数据
- `0.5` = 留 50%（适合需要突出顶部留白的演示场景）

```js
{ type: 'bar', data: [100, 200, 150], yPadding: 0.3 }  // 留 30%
{ type: 'line', data: [...], yPadding: 0 }            // 紧贴
```

#### 不影响

- 内部坐标计算仍用原始数值（柱子高度比例不会因为「万」改变）
- 图表比例不变
- 只改**显示文字**（Y 轴刻度 / 柱顶数值 / Table 单元格）

---

## 5. Table 图表规格（独立于 Bar/Line/Pie）

### 5.1 定位
Table 是 **第 4 种图表**，与 Bar/Line/Pie 完全并列，不是附属功能。
使用方式：`type: 'table'`，无需 canvas，直接渲染 DOM 表格。

### 5.2 数据形态（自动识别）
- **一维** `number[]`：单行表格（默认，向后兼容）
- **二维** `number[][]`：多行表格（**仅 table 有效**），子数组的 `[0]` 作行名，`[1:]` 作该行数据
  - 列数 = `labels.length`，行数据长度 = `labels.length`，整体长度 = `labels.length + 1`
  - 设计动机：贴近 pandas `DataFrame` 风格，学生最熟

### 5.3 DOM 结构
单行（一维）：
```html
<div class="nova-chart nova-table" data-theme="ocean">
  <div class="nova-title">月销售额（万元）</div>
  <table class="nova-table-el">
    <thead>
      <tr><th>1月</th><th>2月</th>...</tr>
    </thead>
    <tbody>
      <tr><td>120</td><td>150</td>...</tr>
    </tbody>
  </table>
</div>
```

多行（二维）：
```html
<div class="nova-chart nova-table" data-theme="ocean">
  <div class="nova-title">期末成绩单（分）</div>
  <table class="nova-table-el">
    <thead>
      <tr>
        <th class="nova-table-row-head"></th>   <!-- 行头占位 -->
        <th>语文</th><th>数学</th><th>英语</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="nova-table-row-head">张三</td>
        <td>85</td><td>92</td><td>78</td>
      </tr>
      ...
    </tbody>
  </table>
</div>
```

### 5.4 样式
- 主题色应用于：标题、表头背景、斑马纹、悬停高亮
- 多行表格：行头列加粗、暗色主题下带左侧色条 + 文字光晕
- 圆角 8px、间距 1px 隔行
- 窄屏（< 480px）：转卡片布局

### 5.5 行为
- 直接渲染到目标容器（无需 canvas）
- `animation: 'fade'` 作用于容器 opacity
- 其他动画对 table 不生效（不适用）
- 自动识别数据形态，无需新增字段
- bar/line/pie 若传入二维 data，校验时 warn 并回退到一维（不引入新报错）

---

## 6. 动画规格

### 6.1 三种动画
| 名 | 实现 | 时长 | 适用 |
|----|------|------|------|
| `fade` | opacity 0→1 | 400ms ease-out | 三图皆宜（默认） |
| `slide` | transform translateY(20px)→0 | 500ms ease-out | bar/line 更明显 |
| `none` | 立即显示 | 0 | 大量数据 / 性能优先 |

### 6.2 实现原则
- 复用 Chart.js `Animator` 骨架
- 砍掉 `Animation` 类中 90% 的属性插值器
- 只保留 `opacity` 和 `transform` 两个动画属性

---

## 7. 架构

### 7.1 文件结构
- `SPEC.md` — 本文件
- `EXAMPLES.md` — API 用例文档
- `nova-chart.js` — 主库（单文件打包，~3000 行）
- `nova-chart.css` — 数据表样式（独立引入）
- `demo/`
  - `index.html` — 四图 × 三主题 demo

### 7.2 nova-chart.js 内部模块（打包顺序）
```
1. 工具函数（helpers）        ← ~300 行
2. 主题定义（themes）          ← ~80 行
3. Animator（动画核心）        ← ~200 行
4. Scale（Category+Linear）    ← ~500 行
5. Element（Bar/Line/Arc/Point）← ~600 行
6. Controllers（Bar/Line/Pie） ← ~800 行
7. Plugins（Legend/Title/Tooltip）← ~400 行
8. NovaChart 包装类（API 层）   ← ~150 行
9. DataTable 插件               ← ~150 行
```

**总计目标**：~3200 行

### 7.3 NovaChart 包装类核心职责
```js
class NovaChart {
  constructor(id, config) {
    // 1. 校验 config
    // 2. 应用主题
    // 3. 把扁平 config 翻译成 Chart.js 内部结构
    // 4. 实例化内部 Chart 实例
    // 5. 如果 showTable，渲染表格
  }
  draw() { /* 启动渲染 */ }
  update(newConfig) { /* 局部刷新 */ }
  destroy() { /* 销毁 */ }
}
```

---

## 8. 里程碑

### M1：基础骨架（核心可跑）
- [x] NovaChart 包装类实现
- [x] 跑通 Bar 图

### M2：三图齐备
- [x] Line 图
- [x] Pie 图
- [x] Table 图（独立 DOM 渲染）
- [x] 四图 API 一致性验证

### M3：主题与表格
- [x] 实现 3 套主题常量（ocean/sunset/dark）
- [x] 实现 Table 独立图表类型
- [x] 主题色联动验证（表头/斑马纹/网格）

### M4：动画与润色
- [x] 实现 fade / slide / none 三种动画
- [x] Demo 页面（4 图 × 3 主题 = 12 案例）
- [x] EXAMPLES.md 校对

### M5：验收
- [x] 全部 Out of Scope 功能确认未引入
- [x] 代码 ≤ 3500 行（实际 628 行 ✅）
- [x] API 字段 ≤ 9 个（实际 9 个 ✅）
- [x] 跑通 demo 无报错

---

## 9. 验收标准 (Definition of Done)

### 功能性
- [ ] 3 种图表类型均可正常渲染
- [ ] 3 套主题切换无视觉错位
- [ ] `showTable: true` 表格与图同步显示
- [ ] 3 种动画均可切换

### 代码质量
- [ ] 总行数 ≤ 3500
- [ ] 无运行时错误 / 警告
- [ ] 单一 ES Module 入口

### 文档
- [ ] SPEC.md（本文档）完整
- [ ] EXAMPLES.md 反映最终 API
- [ ] demo 页面可独立打开测试

### 兼容性
- [ ] 现代浏览器（Chrome/Edge/Firefox/Safari 近 2 年版本）
- [ ] 不依赖任何 npm 包（除 `@kurkle/color`，Chart.js 原依赖）

---

## 10. 反应式自动重绘（v0.3 新增）

### 设计动机

之前所有版本必须显式调 `chart.update()` 才能刷新图表，对 IoT 实时数据、动画数据场景不友好。
v0.3 起，`chart.config.data` / `labels` 改为 **ES6 Proxy**，写入即重绘。

### 实现要点

| 点 | 决策 |
|----|------|
| 代理机制 | ES6 `Proxy`（零运行时依赖） |
| 代理范围 | `config.data` / `config.labels` 数组；其他字段（theme/title/type/unit）只拦顶层 set |
| 拦截方法 | set / delete / 变更方法（push/pop/shift/unshift/splice/sort/reverse/fill/copyWithin） |
| 不拦截 | 只读方法（forEach/map/filter/slice/concat）—— 避免 render 内部循环 |
| 去抖 | microtask，同帧多次写入只重绘 1 次 |
| 跳过 | `chart.config.data = sameRef`（同引用）不触发 |
| 销毁 | destroy 后再改不触发 |
| 首次动画 | `draw()` 首次才放入场动画；Proxy / update 触发的重绘不动画 |

### 代码增加量

| 文件 | v0.2 → v0.3 |
|------|-------------|
| `nova-chart.js` | +约 80 行 |
| `nova-chart.min.js` | 12.0KB → 12.8KB（+0.8KB） |

### 兼容

- `chart.update(newConfig)` 仍可用，向后兼容
- 同引用赋值、`destroy` 后赋值、`forEach` 只读调用 都不重绘（不会误触发）
- 内部访问数组走 Proxy get，不会因为 Proxy 造成性能下降（Proxy get 几乎无开销）

### 限制

- 二维 table 的内层 row 修改（`chart.config.data[0][1] = 99`）**不触发**重绘 —— 性能考虑。如需改内层，用 `chart.config.data = [...]` 整体替换。
- microtask 去抖要求 `queueMicrotask`，兼容性 IE 11 不支持（但 ESP32 + 现代浏览器场景不受影响）

---

## 11. 不做清单（再强调）

- ❌ TypeScript 重写
- ❌ npm publish 流程
- ❌ 单元测试框架（v1）
- ❌ 持续集成 CI（v1）
- ❌ 服务端渲染
- ❌ 国际化
- ❌ 移动端触摸手势优化（基础响应式即可）

---

## 附录 A：与 Chart.js 原版 API 对照

| 原版 Chart.js | NovaChart.js | 说明 |
|---------------|--------------|------|
| `new Chart(ctx, {type, data:{labels, datasets:[{data}]}})` | `new NovaChart(id, {type, labels, data})` | 扁平化 |
| `data.datasets[0].backgroundColor` | 自动按主题取色 | 不暴露 |
| `options.plugins.title.text` | `title` | 顶层化 |
| `options.plugins.legend.display` | 不暴露（默认显示） | 简化 |
| `options.plugins.tooltip.callbacks.label` | 不暴露（自动 `${value}${unit}`） | 简化 |
| `options.scales.y.beginAtZero` | 不暴露（默认 true） | 简化 |
| `options.animation.duration` | `animation: 'fade'/'slide'/'none'` | 简化为枚举 |

---

**本规格说明书为后续所有开发动作的唯一参考。任何与此 SPEC 冲突的代码改动需先更新本文档。**