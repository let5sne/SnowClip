# SnowClip (雪花剪藏)

**SnowClip** 是一个纯净、轻量的浏览器扩展，旨在将网页内容一键转换为大语言模型（LLM）友好的格式（Markdown、JSON、XML）。

![SnowClip Preview](docs/images/preview.png)

## 功能特点

- 🎯 **精准提取**：支持“框选区域”和“整页提取”两种模式，智能去除广告和导航干扰。
- 📝 **多格式支持**：
    - **Markdown**：适合直接投喂给 ChatGPT、Claude 等。
    - **JSON**：结构化数据，适合程序处理。
    - **XML**：通用数据交换格式。
- 🖼️ **图文下载**：支持导出为 **ZIP** 包，包含 Markdown 文件和所有本地化图片，完美保留上下文。
- ✨ **现代界面**：全新的玻璃拟态设计，配合精致的 SVG 图标，提供极致的视觉体验。
- 📋 **一键复制**：提取结果自动复制到剪贴板，效率倍增。

## 项目结构

```
SnowClip/
├── src/                      # 源代码
│   └── browser-extension/    # Chrome 浏览器扩展
│       ├── manifest.json     # 扩展配置 (Manifest V3)
│       ├── popup.html        # 弹出界面
│       ├── popup.css         # 界面样式
│       ├── popup.js          # 交互逻辑
│       ├── content.js        # 核心提取算法
│       ├── content.css       # 注入样式
│       └── icons/            # 扩展图标
├── docs/                     # 文档
│   ├── INSTALL.md            # 安装指南
│   └── EXTENSION.md          # 详细功能说明
├── index.html                # 营销主页
├── styles.css                # 主页样式
├── README.md
└── LICENSE
```

## 安装指南

1. 下载本项目代码到本地。
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
3. 开启右上角的 **开发者模式**。
4. 点击 **加载已解压的扩展程序**。
5. 选择 `src/browser-extension` 文件夹即可。

详细说明请参考 [docs/INSTALL.md](docs/INSTALL.md)。

## 使用方法

1. **点击图标**：在任意网页点击浏览器右上角的 SnowClip 图标。
2. **选择格式**：在下拉菜单中选择需要的格式（Markdown/JSON/XML/ZIP）。
3. **开始提取**：
    - 点击 **框选区域提取**：鼠标拖拽选择感兴趣的内容区域。
    - 点击 **提取整页内容**：自动识别并提取正文。
4. **获取结果**：内容会自动复制到剪贴板（ZIP 模式会自动下载）。

## License

[MIT](LICENSE)
