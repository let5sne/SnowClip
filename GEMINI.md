# SnowClip (雪花剪藏)

## 项目概览

**SnowClip (雪花剪藏)** 是一个纯净网页内容提取工具，旨在将网页内容转换为大语言模型（LLM）友好的格式（Markdown、JSON、XML）。它像雪花一样轻量、纯净，帮助你从混沌的网页中提取有价值的信息。

它由两个主要组件组成：
1.  **浏览器扩展：** 一个 Chrome 扩展（Manifest V3），允许用户直接从浏览器中框选并提取内容。
2.  **Python 脚本：** 用于程序化网页抓取和内容结构化的独立脚本。

## 目录结构

*   `src/browser-extension/`：Chrome 扩展的源代码。
    *   `manifest.json`：扩展配置（Manifest V3）。
    *   `content.js`：DOM 遍历和内容提取的核心逻辑。
    *   `popup.html` & `popup.js`：扩展弹出窗口的用户界面。
*   `scripts/`：实用脚本。
    *   `mcp.py`：使用 `requests` 和 `BeautifulSoup` 获取并结构化网页内容的 Python 脚本。
    *   `generate_icons.py`：用于生成扩展图标的辅助工具。
*   `docs/`：文档。
    *   `EXTENSION.md`：扩展的详细功能列表和使用说明。
    *   `INSTALL.md`：安装指南。

## 构建与运行

### 浏览器扩展

该扩展不需要构建步骤（无 webpack/bundler）。它作为原始源码扩展运行。

1.  **在 Chrome 中加载：**
    *   访问 `chrome://extensions/`。
    *   启用“开发者模式”。
    *   点击“加载已解压的扩展程序”并选择 `src/browser-extension` 目录。

### Python 脚本

**先决条件：**
*   Python 3.x
*   依赖项：`requests`，`beautifulsoup4`

**安装：**
```bash
pip install requests beautifulsoup4
```

**用法：**
```bash
# 运行抓取脚本（当前目标为硬编码的 URL）
python scripts/mcp.py
```

## 主要功能

*   **内容提取：** 支持标题、段落、代码块、列表、表格、图片和链接。
*   **格式：** 导出为 Markdown、JSON 和 XML。
*   **交互：**
    *   **扩展：** 支持“区域框选”（拖动选择）和“整页”提取。自动复制到剪贴板。
    *   **脚本：** 获取 HTML 并将其解析为结构化的 JSON 文件（默认为 `wechat_dev_seo_structured.json`）。

## 开发规范

*   **扩展架构：** 使用标准 Web 技术（HTML/CSS/JS），无需框架。
*   **Manifest 版本：** 严格遵循 V3。
*   **Python 风格：** 遵循标准 Python 脚本实践。
*   **文档：** 在 `docs/` 文件夹中维护文档；`README.md` 作为项目入口点。