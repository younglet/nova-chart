import { defineConfig } from 'vitepress'

// GitHub Pages project site uses /<repo>/ subpath; keep '/' for local dev.
const base = process.env.GITHUB_ACTIONS ? '/nova-chart/' : '/'

export default defineConfig({
  base,
  title: 'NovaChart.js',
  description: '为 Python 基础学生打造的极简图表库',
  lang: 'zh-CN',
  lastUpdated: true,

  // 跨仓库相对路径（如 ../../../nova-server/）在本地多仓库联调时有效，
  // 但在 CI 里没有该目录，会被判为死链。部署后链接仍可点击但目标不存在。
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/what-is-nova-chart', activeMatch: '/guide/' },
      { text: 'API', link: '/api/config', activeMatch: '/api/' },
      { text: '示例', link: '/examples/bar', activeMatch: '/examples/' },
      { text: '演示', link: '/demo/' },
      {
        text: '生态',
        items: [
          { text: 'novajs', link: 'https://younglet.github.io/novajs/' },
          { text: 'Nova Style', link: 'https://younglet.github.io/nova-style/' },
          { text: 'Nova UI', link: 'https://younglet.github.io/nova-ui/' },
          { text: 'NovaChart', link: 'https://younglet.github.io/nova-chart/' },
          { text: 'Nova Server', link: 'https://younglet.github.io/nova-server/' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            { text: '什么是 NovaChart？', link: '/guide/what-is-nova-chart' },
            { text: '为什么选择它？', link: '/guide/why-nova-chart' }
          ]
        },
        {
          text: '上手',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '第一个图表', link: '/guide/first-chart' },
            { text: '数据表格', link: '/guide/table-chart' },
            { text: '大数值场景', link: '/guide/auto-scale' }
          ]
        },
        {
          text: '深入',
          items: [
            { text: '三套主题', link: '/guide/themes' },
            { text: '基础动画', link: '/guide/animations' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'config 完整字段', link: '/api/config' },
            { text: 'NovaChart 类', link: '/api/class' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '分类示例',
          items: [
            { text: '柱状图 Bar', link: '/examples/bar' },
            { text: '折线图 Line', link: '/examples/line' },
            { text: '饼图 Pie', link: '/examples/pie' },
            { text: '表格 Table', link: '/examples/table' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname/nova-chart' }
    ],

    footer: {
      message: '专为 NovaMP 2.0 设计 · powered by stemstar',
      copyright: ''
    },

    search: {
      provider: 'local'
    }
  },

  head: [
    ['meta', { name: 'theme-color', content: '#00F5FF' }],
    ['meta', { property: 'og:title', content: 'NovaChart.js' }],
    ['meta', { property: 'og:description', content: '为 Python 基础学生打造的极简图表库' }],
    ['link', { rel: 'stylesheet', href: '/nova-chart.css' }],
    ['script', { src: '/nova-chart.js', defer: true }]
  ],

  server: {
    host: '0.0.0.0',
    port: 5176,
    allowedHosts: ['novajs.localhost', 'nova-style.localhost', 'nova-ui.localhost', 'nova-chart.localhost', 'localhost']
  }
})