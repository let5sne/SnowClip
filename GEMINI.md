# SnowClip (雪花剪藏)

## 项目概览

**SnowClip (雪花剪藏)** 是一个纯净网页内容提取 Chrome 扩展，将网页内容转换为大语言模型（LLM）友好的格式（Markdown、JSON、XML、ZIP）。轻量、无构建步骤，纯 HTML/CSS/JS。

## 目录结构

- `src/browser-extension/`：Chrome 扩展源代码（Manifest V3）。
  - `manifest.json`：扩展配置。
  - `content.js`：DOM 遍历与内容提取核心逻辑。
  - `background.js`：Service Worker，快捷键监听 + 图片下载代理（绕过 CORS）。
  - `popup.html` / `popup.js`：扩展弹窗界面与交互。
  - `lib/jszip.min.js`：ZIP 打包依赖。
- `test/extract-test.html`：`extractContent` 纯函数断言自测页。
- `docs/`：文档（`EXTENSION.md` 功能说明、`INSTALL.md` 安装指南）。
- `index.html` / `styles.css`：营销主页。

## 构建与运行

无构建步骤。在 Chrome 加载 `src/browser-extension` 目录即可（`chrome://extensions/` → 开发者模式 → 加载已解压扩展）。改代码后点扩展卡片刷新图标热更新。

## 主要功能

- **三种提取模式**：区域框选、元素选择（快捷键）、整页提取。
- **正文容器识别**：整页提取时针对微信公众号、掘金、CSDN、知乎专栏、简书自动收敛到正文容器，避开 UI 残渣。
- **噪声过滤**：跳过占位图片（data URI SVG / 1×1 透明图）、空图片、`javascript:` 伪链接、空链接。
- **格式**：Markdown、JSON、XML、ZIP（含本地化图片）。
- **内联保留**：段落/标题/列表项内的链接、行内代码、加粗、斜体以 Markdown 语法保留；列表支持嵌套缩进；表格识别 `<thead>`。

## 开发规范

- Manifest V3（service worker）。
- 无框架，纯 HTML/CSS/JS，中文 UI 与注释。
- 文档维护在 `docs/`，`README.md` 为项目入口。
