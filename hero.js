// Hero 区用的交互示例
(function() {
  const code = `
new NovaChart('hero', {
  type: 'bar',
  title: '月考成绩',
  labels: ['语文', '数学', '英语', '物理', '化学'],
  data: [85, 92, 78, 88, 90],
  unit: '分',
  theme: 'dark'
}).draw();`;
  console.log(code);
})();