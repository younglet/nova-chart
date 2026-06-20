<template>
  <div class="nova-chart-demo">
    <div :id="containerId" :style="{ minHeight: height + 'px' }"></div>
    <div v-if="showCode" class="nova-code-toggle">
      <button @click="codeOpen = !codeOpen">
        {{ codeOpen ? '隐藏' : '查看' }}代码
      </button>
      <pre v-if="codeOpen" v-html="formattedCode"></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  config: { type: Object, required: true },
  height: { type: Number, default: 360 },
  showCode: { type: Boolean, default: false }
})

const codeOpen = ref(false)
let chartInstance = null
let userExplicitTheme = false  // 记录用户是否显式指定 theme

// 生成唯一 ID
const uid = Math.random().toString(36).slice(2, 9)
const containerId = `nova-${uid}`

const formattedCode = computed(() => {
  const code = `new NovaChart('${containerId}', ${JSON.stringify(props.config, null, 2)}).draw();`
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span style="color:#FF00E5">"$1"</span>:')
    .replace(/'([^']+)'/g, "<span style='color:#39FF14'>'$1'</span>")
})

const { isDark } = useData()

// 计算最终 config：站点暗黑时默认 dark 主题，但尊重用户显式指定
function buildConfig() {
  if (props.config.theme) {
    userExplicitTheme = true
    return { ...props.config }
  }
  return { theme: isDark.value ? 'dark' : 'ocean', ...props.config }
}

onMounted(() => {
  const init = () => {
    if (typeof window === 'undefined' || !window.NovaChart) {
      setTimeout(init, 50)
      return
    }
    chartInstance = new window.NovaChart(containerId, buildConfig())
    chartInstance.draw()
  }
  init()
})

// 监听站点暗黑切换：跟随变化（除非用户显式指定了主题）
watch(isDark, (newDark) => {
  if (!chartInstance || userExplicitTheme) return
  chartInstance.update({ theme: newDark ? 'dark' : 'ocean' })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.nova-chart-demo {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.nova-chart-demo > div:first-child {
  padding: 12px;
}

/* 暗黑模式下容器加深 */
:global(.dark) .nova-chart-demo {
  background: rgba(10, 10, 20, 0.3);
  border-color: rgba(0, 245, 255, 0.15);
}

.nova-code-toggle {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.nova-code-toggle button {
  appearance: none;
  background: transparent;
  border: none;
  color: var(--vp-c-brand-1);
  padding: 8px 16px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.nova-code-toggle button:hover {
  color: var(--vp-c-brand-2);
}

.nova-code-toggle pre {
  margin: 0;
  padding: 12px 16px;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--vp-c-text-1);
}
</style>