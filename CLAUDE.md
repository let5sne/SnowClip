# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

**SnowClip (雪花剪藏)** 是一个 Chrome 浏览器扩展，用于将网页内容提取并转换为 LLM 友好的格式（Markdown、JSON、XML）。支持框选提取、元素选择和整页提取三种模式，可导出为 ZIP 包含本地化图片。

## 开发命令

本项目无需构建步骤（无 webpack/bundler）。

**在 Chrome 中加载扩展：**
1. 访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"并选择 `src/browser-extension` 目录

## 核心架构

### 浏览器扩展 (`src/browser-extension/`)

扩展采用 Manifest V3 架构，主要组件：

- **popup.js** - 用户界面逻辑，处理按钮点击、格式选择，通过 `chrome.tabs.sendMessage` 与 content script 通信
- **content.js** - 核心提取逻辑，包含：
  - 三种提取模式：框选（`startSelectionMode`）、元素选择（`startElementSelectionMode`）、整页
  - 正文容器识别（`getExtractionRoot` + `SITE_ROOT_RULES`）：整页提取时按站点规则收敛到正文容器（微信/掘金/CSDN/知乎专栏/简书），避开 UI 残渣；框选/元素选择不受影响
  - 噪声过滤（`isNoiseImage`/`isNoiseLink`）：跳过 data URI 占位图、空图片、`javascript:` 伪链接；读 `getAttribute` 而非 `.src`/`.href` 避免浏览器规范化空值为页面 URL
  - 内联提取（`extractInlineText`/`collectListItems`）：段落/标题/列表项内保留链接/行内代码/加粗/斜体为 Markdown 语法，列表支持嵌套缩进
  - 内容提取算法（`extractContent`）：递归遍历 DOM，识别标题/段落/代码块/列表/表格/图片/链接
  - 格式转换（`toMarkdown`、`toXML`），表格表头感知（`header` 字段）
  - ZIP 打包逻辑（`handleZipDownload`）：图片通过 background script 代理下载
- **background.js** - Service Worker，处理快捷键命令和图片下载代理（绕过 CORS）

### 数据流

1. popup.js 发送消息 → content.js 执行提取
2. content.js 调用 `extractContent()` 递归遍历 DOM 构建结构化数据
3. 结构化数据通过 `formatContent()` 转换为目标格式
4. 非 ZIP 格式自动复制到剪贴板；ZIP 格式通过 JSZip 打包下载

### 快捷键

- `Alt+Shift+X` (Windows/Linux) / `Command+Shift+X` (Mac) - 切换元素选择模式
- `ESC` - 取消选择

## 关键文件说明

| 文件 | 职责 |
|------|------|
| `content.js` | 所有内容提取和转换逻辑 |
| `background.js` | 快捷键监听 + 图片下载代理 |
| `popup.js` | UI 交互和消息分发 |
| `manifest.json` | 扩展权限和配置 |
| `lib/jszip.min.js` | ZIP 打包依赖 |
| `test/extract-test.html` | `extractContent` 纯函数断言自测（浏览器打开即跑） |

## 开发规范

- 使用 Manifest V3（service worker 而非 background page）
- 无框架，纯 HTML/CSS/JS
- 中文 UI 和注释
