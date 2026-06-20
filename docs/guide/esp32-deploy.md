# 部署到 ESP32 + MicroPython server

> 把 nova-chart 三件套（nova-chart.min.js + nova-chart.min.css）+ 你的 HTML 写到 ESP32。
> 完整 MicroPython 烧录流程见 [novajs 的部署文档](/guide/esp32-deploy)（任务 7 完整版）。

## 一次性

1. 烧 MicroPython 固件
2. 上传 main.py（HTTP server 模板）
3. 上传 3 个文件到 `/static/`

## 上传文件

```bash
# 启静态服务
python3 -m http.server 8000 --directory src

# 浏览器打开文档站首页的「下载到 ESP32」按钮（自动）
# 或手动：
#   src/nova-chart.min.js    → /static/nova-chart.min.js
#   src/nova-chart.min.css   → /static/nova-chart.min.css
#   写一个 index.novachart.html 到 /static/
```

## index.novachart.html 模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>实时传感器图表</title>
  <link rel="stylesheet" href="/static/nova-chart.min.css">
  <style>
    body { font-family: system-ui; background: #f5f7fa; margin: 0; padding: 16px; }
    h1 { text-align: center; color: #2c3e50; }
  </style>
</head>
<body>
  <h1>温度趋势（最近 1 小时）</h1>
  <div id="chart" style="max-width: 800px; margin: 0 auto;"></div>

  <script src="/static/nova-chart.min.js"></script>
  <script>
    const labels = Array.from({length: 12}, (_,i) => (i*5) + 'min')
    const temps  = [22.3, 22.5, 23.1, 23.8, 24.2, 24.5, 24.8, 25.1, 25.0, 24.7, 24.3, 24.0]
    new NovaChart('chart', {
      type: 'line',
      title: '温度 (°C)',
      labels, data: temps,
      unit: '°C',
      theme: 'ocean'
    })
  </script>
</body>
</html>
```

## 文件清单

| 文件 | 大小 | 路径 |
|---|---|---|
| `nova-chart.min.js` | 12 KB | `/static/nova-chart.min.js` |
| `nova-chart.min.css` | 1.5 KB | `/static/nova-chart.min.css` |
| `index.novachart.html` | < 1 KB | `/static/index.novachart.html` |

**总传输：~14 KB**。ESP32-WROOM 4MB flash 完全够。

## 数据从 ESP32 来

把上面的示例数据换成从 `/api/sensors` 拉的真实数据：

```html
<script>
  fetch('/api/sensors')
    .then(r => r.json())
    .then(s => {
      new NovaChart('chart', {
        type: 'line',
        title: '温度 (°C)',
        labels: s.timestamps,
        data: s.temperatures,
        unit: '°C',
        theme: 'ocean'
      })
    })
</script>
```

MicroPython main.py 加一个 `/api/sensors` 路由即可，详见 [novajs 部署文档](/guide/esp32-deploy) 的 main.py 模板。
