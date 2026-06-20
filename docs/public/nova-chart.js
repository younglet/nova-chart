/*!
 * NovaChart.js v0.1
 * https://github.com/yourname/nova-chart
 * (c) 2026 NovaChart Contributors
 * Released under the MIT License
 *
 * A simplified charting library for Python beginners.
 * Inspired by Chart.js v4.5.0
 */
(function (global) {
  'use strict';

  // ============================================================
  // 1. 主题定义 (Themes) — 三套色卡，一赛博朋克暗色
  // ============================================================
  const THEMES = {
    ocean: {
      name: 'ocean',
      background: '#FFFFFF',
      text:       '#2C3E50',
      grid:       '#ECF0F1',
      palette:    ['#4A90E2', '#50C9C3', '#F5A623', '#7B61FF', '#FF6B6B'],
      tableHead:  '#4A90E2',
      zebra:      '#F8FAFC'
    },
    sunset: {
      name: 'sunset',
      background: '#FFF9F0',
      text:       '#333333',
      grid:       '#FFE8C7',
      palette:    ['#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', '#4D96FF'],
      tableHead:  '#FFA94D',
      zebra:      '#FFF3E0'
    },
    dark: {
      // Dracula 调色板 (https://draculatheme.com)
      // 克制：低饱和 + 描边 + 不发光的灰；去除高饱和电光与发光霓虹
      name:       'dark',
      background: '#282A36',                       // Dracul 背景
      text:       '#F8F8F2',                       // Dracul 前景
      grid:       '#44475A',                       // Dracul 当前行 / 网格
      tableHead:  '#44475A',                       // 表头同色
      zebra:      '#343746',                       // 奇数行（比背景略亮）
      palette:    [
        '#8BE9FD',  // 青
        '#50FA7B',  // 绿
        '#FFB86C',  // 橙
        '#FF79C6',  // 粉
        '#BD93F9'   // 紫
      ],
      // 说明：不设 `glow: true` → 所有 shadowBlur 分支不触发
    }
  };

  // ============================================================
  // 2. 默认配置
  // ============================================================
  const DEFAULTS = {
    type: 'bar',
    title: '',
    labels: [],
    data: [],
    unit: '',
    theme: 'ocean',
    animation: 'fade'
  };

  const VALID_TYPES = ['bar', 'line', 'pie', 'table'];
  const VALID_THEMES = Object.keys(THEMES);
  const VALID_ANIMATIONS = ['fade', 'slide', 'none'];

  // ============================================================
  // 3. 工具函数 (Helpers)
  // ============================================================

  function isString(v) { return typeof v === 'string'; }
  function isNumber(v) { return typeof v === 'number' && !isNaN(v); }
  function isArray(v)  { return Array.isArray(v); }

  // 判断是否为二维数组：外层数组且第一个元素仍是数组
  function is2DArray(v) {
    return isArray(v) && v.length > 0 && isArray(v[0]);
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function getColor(theme, index) {
    return theme.palette[index % theme.palette.length];
  }

  /**
   * 根据最大数值选最合适的量级除数 + 后缀
   * - 中文场景优先：万 / 亿
   * - 英文场景：K / M / B
   * - < 1000 不缩放
   */
  function getScale(maxValue) {
    if (maxValue >= 1e8) return { divisor: 1e8, suffix: '亿' };
    if (maxValue >= 1e4) return { divisor: 1e4, suffix: '万' };
    if (maxValue >= 1e9) return { divisor: 1e9, suffix: 'B' };
    if (maxValue >= 1e6) return { divisor: 1e6, suffix: 'M' };
    if (maxValue >= 1e3) return { divisor: 1e3, suffix: 'K' };
    return { divisor: 1, suffix: '' };
  }

  /**
   * 格式化数值：大数值自动缩放显示
   * @param value  原始数值
   * @param unit   unit 字段
   * @param scale  getScale() 的返回值
   */
  function formatValue(value, unit, scale) {
    if (!isNumber(value)) return String(value);
    const s = scale || { divisor: 1, suffix: '' };

    if (s.divisor > 1) {
      const scaled = value / s.divisor;
      let formatted;
      if (scaled >= 100)      formatted = scaled.toFixed(0);
      else if (scaled >= 10)  formatted = scaled.toFixed(1);
      else if (scaled >= 1)   formatted = scaled.toFixed(2);
      else                    formatted = scaled.toFixed(3);
      // 去尾随零（只处理小数部分，不动整数位）
      if (formatted.includes('.')) {
        formatted = formatted.replace(/0+$/, '').replace(/\.$/, '');
      }
      return unit ? `${formatted}${s.suffix}${unit}` : `${formatted}${s.suffix}`;
    }

    // 原样输出
    const formatted = Number.isInteger(value)
      ? value.toLocaleString('en-US')
      : value.toFixed(2);
    return unit ? `${formatted}${unit}` : formatted;
  }

  function getDPR() { return window.devicePixelRatio || 1; }

  function setupCanvas(canvas, width, height) {
    const dpr = getDPR();
    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  }

  // 霓虹光晕辅助：暗色主题下为画笔加发光效果
  function applyGlow(ctx, color, blur = 12) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }

  function clearGlow(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  // ============================================================
  // 4. 简易动画器 (Animator)
  // ============================================================
  const Animator = {
    running: false,
    items: [],

    add(item) {
      this.items.push(item);
      if (!this.running) this.run();
    },

    run() {
      this.running = true;
      const tick = () => {
        let stillRunning = false;
        this.items = this.items.filter(item => {
          if (item.done) return false;
          const alive = item.tick();
          if (alive) stillRunning = true;
          return alive;
        });
        if (stillRunning) {
          requestAnimationFrame(tick);
        } else {
          this.running = false;
        }
      };
      requestAnimationFrame(tick);
    }
  };

  function createFadeAnimation(duration, onUpdate, onComplete) {
    return {
      done: false,
      start: performance.now(),
      duration,
      tick() {
        const elapsed = performance.now() - this.start;
        const t = clamp(elapsed / this.duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        onUpdate(eased);
        if (t >= 1) {
          this.done = true;
          if (onComplete) onComplete();
          return false;
        }
        return true;
      }
    };
  }

  function createSlideAnimation(duration, onUpdate, onComplete) {
    return {
      done: false,
      start: performance.now(),
      duration,
      tick() {
        const elapsed = performance.now() - this.start;
        const t = clamp(elapsed / this.duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        onUpdate(eased);
        if (t >= 1) {
          this.done = true;
          if (onComplete) onComplete();
          return false;
        }
        return true;
      }
    };
  }

  // ============================================================
  // 5. 坐标轴 / 布局工具
  // ============================================================

  function niceMax(value, padding) {
    const p = (typeof padding === 'number') ? padding : 0.1;
    if (value <= 0) return 10 * (1 + p);
    const exp = Math.floor(Math.log10(value));
    const base = Math.pow(10, exp);
    const norm = value / base;
    let nice;
    if (norm <= 1)      nice = 1;
    else if (norm <= 2) nice = 2;
    else if (norm <= 5) nice = 5;
    else                nice = 10;
    return nice * base * (1 + p);
  }

  function calcTicks(maxValue, count = 5) {
    const step = maxValue / count;
    return Array.from({ length: count + 1 }, (_, i) => step * i);
  }

  /**
   * 绘制 Y 轴网格 + 刻度文字（Bar/Line 共享）
   */
  function drawYAxisGrid(ctx, theme, padding, chartW, chartH, max, ticks, scale) {
    clearGlow(ctx);
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = theme.text;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ticks.forEach(t => {
      const y = padding.top + chartH - (t / max) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
      ctx.fillText(formatValue(t, '', scale), padding.left - 6, y);
    });
  }

  // ============================================================
  // 6. BarChart 实现
  // ============================================================
  function drawBarChart(ctx, config, theme, width, height) {
    const padding = { top: 30, right: 20, bottom: 60, left: 50 };
    const chartW = width  - padding.left - padding.right;
    const chartH = height - padding.top  - padding.bottom;
    const isGlow = !!theme.glow;

    const data  = config.data;
    const yPadding = (typeof config.yPadding === 'number') ? config.yPadding : 0.1;
    const max   = niceMax(Math.max(...data, 1), yPadding);
    const scale = getScale(max);
    const ticks = calcTicks(max, 5);

    // 背景
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);

    // 网格 + Y 轴刻度（Bar/Line 共享）
    drawYAxisGrid(ctx, theme, padding, chartW, chartH, max, ticks, scale);

    // 柱子
    const barCount = data.length;
    const slotW = chartW / barCount;
    const barW = slotW * 0.6;
    const barOffset = (slotW - barW) / 2;

    data.forEach((value, i) => {
      const x = padding.left + i * slotW + barOffset;
      const barH = (value / max) * chartH;
      const y = padding.top + chartH - barH;
      const color = getColor(theme, i);

      // 渐变填充
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + (isGlow ? 'FF' : 'CC'));

      // 暗色主题：先画发光轮廓，再画填充
      if (isGlow) {
        applyGlow(ctx, color, 15);
        ctx.fillStyle = color + '55';
        ctx.fillRect(x - 1, y - 1, barW + 2, barH + 2);
        clearGlow(ctx);
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, barH);

      // 顶部数值
      ctx.fillStyle = theme.text;
      ctx.font = isGlow ? 'bold 12px sans-serif' : '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(formatValue(value, config.unit, scale), x + barW / 2, y - 4);
    });

    // X 轴标签
    ctx.fillStyle = theme.text;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    config.labels.forEach((label, i) => {
      const x = padding.left + i * slotW + slotW / 2;
      ctx.fillText(label, x, padding.top + chartH + 8);
    });
  }

  // ============================================================
  // 7. LineChart 实现
  // ============================================================
  function drawLineChart(ctx, config, theme, width, height) {
    const padding = { top: 30, right: 20, bottom: 60, left: 50 };
    const chartW = width  - padding.left - padding.right;
    const chartH = height - padding.top  - padding.bottom;
    const isGlow = !!theme.glow;

    const data  = config.data;
    const yPadding = (typeof config.yPadding === 'number') ? config.yPadding : 0.1;
    const max   = niceMax(Math.max(...data, 1), yPadding);
    const scale = getScale(max);
    const ticks = calcTicks(max, 5);

    // 背景
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);

    // 网格 + Y 轴刻度（Bar/Line 共享）
    drawYAxisGrid(ctx, theme, padding, chartW, chartH, max, ticks, scale);

    // 计算点坐标
    const count = data.length;
    const step = count > 1 ? chartW / (count - 1) : 0;
    const points = data.map((v, i) => ({
      x: padding.left + i * step,
      y: padding.top + chartH - (v / max) * chartH,
      v: v
    }));

    const color = getColor(theme, 0);

    // 填充区域
    clearGlow(ctx);
    ctx.fillStyle = isGlow ? color + '22' : color + '33';
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fill();

    // 折线（暗色加发光）
    if (isGlow) {
      applyGlow(ctx, color, 18);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
    }
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else         ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    clearGlow(ctx);

    // 数据点
    points.forEach(p => {
      if (isGlow) applyGlow(ctx, color, 12);
      ctx.fillStyle = isGlow ? color : theme.background;
      ctx.strokeStyle = color;
      ctx.lineWidth = isGlow ? 2 : 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isGlow ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    clearGlow(ctx);

    // 数值标签
    ctx.fillStyle = theme.text;
    ctx.font = isGlow ? 'bold 12px sans-serif' : '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    points.forEach(p => {
      ctx.fillText(formatValue(p.v, config.unit, scale), p.x, p.y - 8);
    });

    // X 轴标签
    config.labels.forEach((label, i) => {
      const x = padding.left + i * step;
      ctx.fillStyle = theme.text;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, x, padding.top + chartH + 8);
    });
  }

  // ============================================================
  // 8. PieChart 实现
  // ============================================================
  function drawPieChart(ctx, config, theme, width, height) {
    const cx = width / 2;
    const cy = height / 2 + 10;
    const radius = Math.min(width, height) / 2 - 50;
    const isGlow = !!theme.glow;

    // 背景
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);

    const data = config.data;
    const total = data.reduce((s, v) => s + v, 0) || 1;
    const angleStep = (Math.PI * 2) / total;

    let startAngle = -Math.PI / 2;
    data.forEach((value, i) => {
      const sliceAngle = value * angleStep;
      const endAngle = startAngle + sliceAngle;
      const color = getColor(theme, i);

      // 暗色：先画外发光环
      if (isGlow) {
        applyGlow(ctx, color, 20);
        ctx.fillStyle = color + '88';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius + 2, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        clearGlow(ctx);
      }

      // 扇形
      ctx.fillStyle = isGlow ? color + 'DD' : color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // 边框
      ctx.strokeStyle = theme.background;
      ctx.lineWidth = isGlow ? 1 : 2;
      ctx.stroke();

      // 标签引导线
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius + 20;
      const labelX = cx + Math.cos(midAngle) * labelR;
      const labelY = cy + Math.sin(midAngle) * labelR;

      if (isGlow) applyGlow(ctx, color, 8);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(midAngle) * radius, cy + Math.sin(midAngle) * radius);
      ctx.lineTo(labelX, labelY);
      ctx.stroke();
      clearGlow(ctx);

      // 百分比
      const pct = ((value / total) * 100).toFixed(1) + '%';
      ctx.fillStyle = theme.text;
      ctx.font = isGlow ? 'bold 12px sans-serif' : '12px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = midAngle > Math.PI / 2 || midAngle < -Math.PI / 2 ? 'right' : 'left';
      const offsetX = midAngle > Math.PI / 2 || midAngle < -Math.PI / 2 ? -4 : 4;
      ctx.fillText(`${config.labels[i]} ${pct}`, labelX + offsetX, labelY);

      startAngle = endAngle;
    });
  }

  // ============================================================
  // 9. TableChart 实现（DOM 表格）
  //    自动识别一维 number[] / 二维 number[][]
  //    - 一维：单行表格（向后兼容）
  //    - 二维：多行表格，子数组 [0] 作行名，[1..] 作该行数据
  // ============================================================

  /**
   * 应用标题样式：所有主题都有底色
   * - dark 主题：主题色 33% 透明 + 茺光
   * - 普通主题：主题色 8% 透明（低调而可见）
   */
  function applyTitleStyle(title, theme, isGlow) {
    const accent = getColor(theme, 0);
    title.style.color = isGlow ? accent : theme.text;
    const alpha = isGlow ? '33' : '14';
    title.style.background = `linear-gradient(90deg, ${accent}${alpha}, transparent)`;
    title.style.borderLeft = `3px solid ${accent}`;
    title.style.paddingLeft = '12px';
    title.style.paddingRight = '12px';
    if (isGlow) {
      title.style.textShadow = `0 0 8px ${accent}99`;
      title.style.letterSpacing = '1px';
    } else {
      title.style.textShadow = '';
      title.style.letterSpacing = '';
    }
    title.style.marginBottom = '12px';
  }

  function renderTable(container, config, theme) {
    container.innerHTML = '';
    container.className = `nova-chart nova-table nova-theme-${theme.name}`;
    container.dataset.theme = theme.name;
    container.style.backgroundColor = theme.background;

    const isGlow = !!theme.glow;
    const headerColor = isGlow ? getColor(theme, 0) : theme.tableHead;
    const isMultiRow = is2DArray(config.data);

    // 计算 dataMax（多行表格只算 row[1..]）
    let dataMax = 1;
    if (isMultiRow) {
      config.data.forEach(row => {
        row.slice(1).forEach(v => { if (isNumber(v) && v > dataMax) dataMax = v; });
      });
    } else {
      config.data.forEach(v => { if (isNumber(v) && v > dataMax) dataMax = v; });
    }
    const scale = getScale(dataMax);

    // 标题
    if (config.title) {
      const title = document.createElement('div');
      title.className = 'nova-title';
      title.textContent = config.unit
        ? `${config.title}（${config.unit}）`
        : config.title;
      applyTitleStyle(title, theme, isGlow);
      container.appendChild(title);
    }

    // 表格
    const table = document.createElement('table');
    table.className = 'nova-table-el';

    // ---- 表头 ----
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    // 多行表格：第一格是行头占位
    if (isMultiRow) {
      const thCorner = document.createElement('th');
      thCorner.className = 'nova-table-row-head';
      thCorner.textContent = '';
      if (isGlow) {
        const c = getColor(theme, 0);
        thCorner.style.backgroundColor = c + '22';
        thCorner.style.color = c;
        thCorner.style.borderBottom = `2px solid ${c}`;
      } else {
        thCorner.style.backgroundColor = theme.tableHead;
        thCorner.style.color = theme.text;
      }
      headRow.appendChild(thCorner);
    }

    config.labels.forEach((label, i) => {
      const th = document.createElement('th');
      th.textContent = label;
      const c = isGlow ? getColor(theme, i) : headerColor;
      th.style.backgroundColor = isGlow ? c + '22' : c;
      th.style.color = isGlow ? c : theme.text;
      if (isGlow) {
        th.style.borderBottom = `2px solid ${c}`;
        th.style.textShadow = `0 0 6px ${c}88`;
      }
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // ---- 表体 ----
    const tbody = document.createElement('tbody');

    if (isMultiRow) {
      // 多行表格
      config.data.forEach((row, rowIdx) => {
        const tr = document.createElement('tr');
        const rowBg = rowIdx % 2 === 0 ? theme.background : theme.zebra;

        // 行名（首列）
        const tdRow = document.createElement('td');
        tdRow.className = 'nova-table-row-head';
        tdRow.textContent = String(row[0] != null ? row[0] : '');
        tdRow.style.fontWeight = '600';
        tdRow.style.backgroundColor = rowBg;
        if (isGlow) {
          const c = getColor(theme, rowIdx);
          tdRow.style.color = c;
          tdRow.style.borderLeft = `2px solid ${c}88`;
          tdRow.style.textShadow = `0 0 4px ${c}66`;
        } else {
          tdRow.style.color = theme.text;
          // Dracula 克制版：行头 2px 左边框，颜色从主题色拿
          // 表格跟随主题色板，多行表头左边 2px 色带
          if (theme.name === 'dark' && theme.palette) {
            const c = getColor(theme, rowIdx % theme.palette.length);
            tdRow.style.borderLeft = `2px solid ${c}`;
          }
        }
        tr.appendChild(tdRow);

        // 数据列（row[1..]）
        const values = row.slice(1);
        values.forEach((value, colIdx) => {
          const td = document.createElement('td');
          td.textContent = formatValue(value, config.unit, scale);
          td.style.backgroundColor = rowBg;
          td.style.color = theme.text;
          if (isGlow) {
            const c = getColor(theme, colIdx);
            td.style.borderLeft = `1px solid ${c}33`;
            td.style.borderRight = `1px solid ${c}33`;
          }
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    } else {
      // 单行表格（向后兼容）
      const bodyRow = document.createElement('tr');
      config.data.forEach((value, i) => {
        const td = document.createElement('td');
        td.textContent = formatValue(value, config.unit, scale);
        td.style.backgroundColor = i % 2 === 0 ? theme.background : theme.zebra;
        td.style.color = theme.text;
        if (isGlow) {
          const c = getColor(theme, i);
          td.style.borderLeft = `1px solid ${c}33`;
          td.style.borderRight = `1px solid ${c}33`;
        }
        bodyRow.appendChild(td);
      });
      tbody.appendChild(bodyRow);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // ============================================================
  // 10. NovaChart 主类
  // ============================================================
  class NovaChart {
    constructor(target, userConfig) {
      // 配置合并 + 校验
      this.config = this._validate(Object.assign({}, DEFAULTS, userConfig));
      this.theme  = THEMES[this.config.theme] || THEMES.ocean;
      this._destroyed = false;

      // 查找容器（支持 ID 或 DOM 元素）
      this.container = isString(target)
        ? document.getElementById(target)
        : target;
      if (!this.container) {
        throw new Error(`NovaChart: container "${target}" not found`);
      }
    }

    _validate(cfg) {
      if (!VALID_TYPES.includes(cfg.type)) {
        console.warn(`NovaChart: type "${cfg.type}" 不支持，已回退到 "bar"`);
        cfg.type = 'bar';
      }
      if (!VALID_THEMES.includes(cfg.theme)) {
        console.warn(`NovaChart: theme "${cfg.theme}" 不支持，已回退到 "ocean"`);
        cfg.theme = 'ocean';
      }
      if (!VALID_ANIMATIONS.includes(cfg.animation)) {
        cfg.animation = 'fade';
      }
      if (!isArray(cfg.labels) || !isArray(cfg.data)) {
        throw new Error('NovaChart: labels 和 data 必须是数组');
      }

      // Table 自动识别一维 / 二维；其他图表若误传二维，回退为第一行
      if (is2DArray(cfg.data) && cfg.type !== 'table') {
        console.warn(`NovaChart: ${cfg.type} 图不支持二维 data，已取第一行渲染`);
        cfg.data = cfg.data[0];
      }

      // 长度校验
      if (cfg.type === 'table' && is2DArray(cfg.data)) {
        // 二维：每行长度应 = labels.length + 1（首列是行名）
        const expected = cfg.labels.length + 1;
        cfg.data.forEach((row, i) => {
          if (row.length !== expected) {
            console.warn(`NovaChart: table 第 ${i + 1} 行长度 ${row.length} ≠ labels 长度 ${cfg.labels.length} + 1`);
          }
        });
      } else if (cfg.labels.length !== cfg.data.length) {
        console.warn(`NovaChart: labels (${cfg.labels.length}) 和 data (${cfg.data.length}) 长度不一致`);
      }
      return cfg;
    }

    draw() {
      if (this._destroyed) return this;

      if (this.config.type === 'table') {
        this._drawTable();
      } else {
        this._drawCanvas();
      }

      // 入场动画（容器级）
      this._animateEntry();
      return this;
    }

    _drawTable() {
      renderTable(this.container, this.config, this.theme);
    }

    _drawCanvas() {
      const config = this.config;

      // 创建或复用 canvas
      let canvas = this.container.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        this.container.innerHTML = '';
        this.container.appendChild(canvas);
      }

      // 标题
      let titleEl = this.container.querySelector('.nova-title');
      if (config.title) {
        if (!titleEl) {
          titleEl = document.createElement('div');
          titleEl.className = 'nova-title';
          this.container.insertBefore(titleEl, canvas);
        }
        titleEl.textContent = config.title;
        applyTitleStyle(titleEl, this.theme, !!this.theme.glow);
      } else if (titleEl) {
        titleEl.remove();
      }

      // 尺寸
      const containerW = this.container.clientWidth || 600;
      const w = containerW;
      const h = Math.max(280, Math.min(containerW * 0.6, 420));

      const ctx = setupCanvas(canvas, w, h);
      this.canvas = canvas;
      this.ctx = ctx;
      this.width = w;
      this.height = h;

      // 绘制
      if (config.type === 'bar') {
        drawBarChart(ctx, config, this.theme, w, h);
      } else if (config.type === 'line') {
        drawLineChart(ctx, config, this.theme, w, h);
      } else if (config.type === 'pie') {
        drawPieChart(ctx, config, this.theme, w, h);
      }
    }

    _animateEntry() {
      const anim = this.config.animation;
      if (anim === 'none') return;

      const el = this.container;
      el.style.opacity = '0';
      if (anim === 'slide') {
        el.style.transform = 'translateY(15px)';
      }

      const duration = anim === 'fade' ? 400 : 500;
      Animator.add(createFadeAnimation(duration, (t) => {
        el.style.opacity = t;
        if (anim === 'slide') {
          el.style.transform = `translateY(${(1 - t) * 15}px)`;
        }
      }));
    }

    update(newConfig) {
      if (this._destroyed) return this;
      if (newConfig) {
        this.config = this._validate(Object.assign({}, this.config, newConfig));
        this.theme  = THEMES[this.config.theme] || THEMES.ocean;
      }
      this.draw();
      return this;
    }

    destroy() {
      this._destroyed = true;
      this.container.innerHTML = '';
      this.container.style.opacity = '';
      this.container.style.transform = '';
    }
  }

  // ============================================================
  // 11. 导出
  // ============================================================
  NovaChart.version = '0.1';
  NovaChart.themes  = THEMES;

  // 浏览器全局
  global.NovaChart = NovaChart;

  // ES Module 兼容
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaChart;
  }

})(typeof window !== 'undefined' ? window : this);