import DefaultTheme from 'vitepress/theme'
import NovaChartDemo from './components/NovaChart.vue'
import Esp32Flasher from './components/Esp32Flasher.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件，markdown 里直接用
    app.component('NovaChart', NovaChartDemo)
    app.component('Esp32Flasher', Esp32Flasher)
  }
}
