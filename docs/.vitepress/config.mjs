import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'NovaChart.js',
  description: '为 Python 基础学生打造的极简图表库',
  lang: 'zh-CN',
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/what-is-nova-chart', activeMatch: '/guide/' },
      { text: 'API', link: '/api/config', activeMatch: '/api/' },
      { text: '示例', link: '/examples/bar', activeMatch: '/examples/' },
      { text: '演示', link: '/demo/' },
      {
        text: '生态',
        items: [
          { text: 'novajs', link: 'http://novajs.local' },
          { text: 'Nova Style', link: 'http://nova-style.local' },
          { text: 'Nova UI', link: 'http://nova-ui.local' },
          { text: 'NovaChart', link: 'http://nova-chart.local' }
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
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2026 NovaChart Contributors'
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
  ]
})