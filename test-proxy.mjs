// 测试反应式 Proxy 逻辑（不依赖 canvas/DOM）
import { readFileSync } from 'node:fs';

const src = readFileSync('./src/nova-chart.js', 'utf8');

// Mock 整个浏览器环境
const containers = {};
function getContainer(id) {
  if (!containers[id]) {
    containers[id] = {
      id,
      innerHTML: '',
      clientWidth: 600,
      querySelector: () => null,
      appendChild: function(el) { this.innerHTML += '[el]'; },
      insertBefore: function(el) { this.innerHTML += '[el]'; },
      removeChild: function() {},
      style: {},
      dataset: {},
      classList: { add: () => {}, remove: () => {} },
      children: []
    };
  }
  return containers[id];
}

global.window = global;
global.document = {
  getElementById: getContainer,
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      classList: { add: () => {}, remove: () => {} },
      children: [],
      appendChild: function() {},
      insertBefore: function() {},
      removeChild: function() {},
      setAttribute: function() {},
      querySelector: () => null
    };
    if (tag === 'canvas') {
      el.width = 600;
      el.height = 400;
      el.getContext = () => ({
        scale: () => {},
        fillRect: () => {},
        clearRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        fill: () => {},
        stroke: () => {},
        arc: () => {},
        fillText: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        save: () => {},
        restore: () => {},
        measureText: () => ({ width: 0 })
      });
    }
    return el;
  }
};
global.queueMicrotask = queueMicrotask;
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.performance = { now: () => Date.now() };

let renderCount = 0;
const counter = {};

eval(src);

// 在 NovaChart 上加 counter
const origRenderNow = NovaChart.prototype._renderNow;
NovaChart.prototype._renderNow = function() {
  counter[this.container.id] = (counter[this.container.id] || 0) + 1;
  return origRenderNow.call(this);
};

async function check(name, fn, expected, actual) {
  await fn;
  const pass = expected === actual;
  console.log(`${pass ? '✓' : '✗'} ${name}: 期望 ${JSON.stringify(expected)}, 实际 ${JSON.stringify(actual)}`);
  if (!pass) process.exitCode = 1;
}

async function tick() {
  await new Promise(r => queueMicrotask(r));
  await new Promise(r => setTimeout(r, 10));
}

// ===== 测试 =====
const c = new NovaChart('c1', {
  type: 'bar',
  title: 'T1',
  labels: ['A', 'B', 'C'],
  data: [10, 20, 30],
  animation: 'none'
});

console.log('=== 测试 1: 改 chart.config.data ===');
counter.c1 = 0;
c.config.data = [50, 60, 70];
await tick();
console.log(`  render: ${counter.c1} (期望 1)`);

console.log('=== 测试 2: push 数组方法 ===');
counter.c1 = 0;
c.config.data.push(99);
await tick();
console.log(`  render: ${counter.c1} (期望 1), data.length: ${c.config.data.length}`);

console.log('=== 测试 3: 索引赋值 ===');
counter.c1 = 0;
c.config.data[0] = 0;
await tick();
console.log(`  render: ${counter.c1} (期望 1)`);

console.log('=== 测试 4: title 改 ===');
counter.c1 = 0;
c.config.title = '新标题';
await tick();
console.log(`  render: ${counter.c1} (期望 1), title: "${c.config.title}"`);

console.log('=== 测试 5: theme 改 ===');
counter.c1 = 0;
c.config.theme = 'sunset';
await tick();
console.log(`  render: ${counter.c1} (期望 1), theme: "${c.config.theme}"`);

console.log('=== 测试 6: microtask 去抖 ===');
counter.c1 = 0;
c.config.data[0] = 1;
c.config.data[1] = 2;
c.config.data[2] = 3;
c.config.title = 'X';
c.config.data.push(99);
console.log(`  同步改完 render: ${counter.c1} (期望 0，未跑 microtask)`);
await tick();
console.log(`  microtask 后 render: ${counter.c1} (期望 1)`);

console.log('=== 测试 7: update() 兼容 ===');
counter.c1 = 0;
c.update({ data: [100, 200], title: 'updated' });
console.log(`  update 后立即 render: ${counter.c1} (期望 1，update 内部调 _renderNow)`);
console.log(`  data: [${c.config.data.join(',')}], title: "${c.config.title}"`);

console.log('=== 测试 8: 相同引用赋值 ===');
counter.c1 = 0;
const same = c.config.data;
c.config.data = same;
await tick();
console.log(`  render: ${counter.c1} (期望 0，无变化)`);

console.log('=== 测试 9: destroy 后 ===');
counter.c1 = 0;
c.destroy();
c.config.data = [1, 2, 3];
await tick();
console.log(`  render: ${counter.c1} (期望 0)`);

console.log('=== 测试 10: table 二维 data 顶层 push ===');
const t = new NovaChart('t1', {
  type: 'table',
  title: '成绩',
  labels: ['语文', '数学'],
  data: [['张三', 85, 92], ['李四', 75, 88]],
  animation: 'none'
});
counter.t1 = 0;
t.config.data.push(['王五', 90, 95]);
await tick();
console.log(`  render: ${counter.t1} (期望 1), 行数: ${t.config.data.length}`);

console.log('=== 测试 11: __novaReactive 标记 ===');
console.log(`  data.__novaReactive: ${c.config.data.__novaReactive} (期望 true)`);

console.log('=== 测试 12: labels 改 ===');
counter.c1 = 0;
const c2 = new NovaChart('c2', {
  type: 'bar',
  labels: ['X', 'Y'],
  data: [1, 2],
  animation: 'none'
});
counter.c2 = 0;
c2.config.labels = ['A', 'B', 'C'];
await tick();
console.log(`  render: ${counter.c2} (期望 1)`);
console.log(`  labels: [${c2.config.labels.join(',')}]`);

console.log('=== 测试 13: type 改 ===');
counter.c2 = 0;
c2.config.type = 'line';
await tick();
console.log(`  render: ${counter.c2} (期望 1), type: "${c2.config.type}"`);

console.log('=== 测试 14: splice ===');
counter.c2 = 0;
c2.config.data.splice(1, 1, 99, 100);
await tick();
console.log(`  render: ${counter.c2} (期望 1), data: [${c2.config.data.join(',')}]`);

console.log('=== 测试 15: 反向引用保留 ===');
const saved = c2.config.data;
saved.push(999);
await tick();
console.log(`  saved ref push 后 c2.data: [${c2.config.data.join(',')}] (期望含 999)`);

console.log('\n===所有测试完成===');