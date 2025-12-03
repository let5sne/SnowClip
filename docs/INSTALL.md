# LLM Content Extractor 离线安装指南

## 系统要求

- Chrome 88+ / Edge 88+ / Brave / Arc 等 Chromium 内核浏览器
- 开发者模式权限

## 安装步骤

### 方式一：从源码安装

1. **下载项目**
   ```bash
   git clone git@git.let5see.xyz:let5see/web2mcp.git
   cd web2mcp
   ```

2. **打开扩展管理页面**
   - Chrome：地址栏输入 `chrome://extensions/`
   - Edge：地址栏输入 `edge://extensions/`

3. **开启开发者模式**
   - 点击页面右上角的 **开发者模式** 开关

4. **加载扩展**
   - 点击 **加载已解压的扩展程序**
   - 选择项目中的 `src/browser-extension` 文件夹

5. **完成**
   - 扩展图标会出现在浏览器工具栏
   - 如果没有显示，点击拼图图标 🧩 将其固定

### 方式二：下载 ZIP 安装

1. 从仓库下载 ZIP 包并解压
2. 按照方式一的步骤 2-5 操作

## 更新扩展

1. 拉取最新代码
   ```bash
   git pull origin main
   ```

2. 在扩展管理页面点击 **刷新** 按钮 🔄

## 常见问题

### Q: 扩展无法使用？
刷新目标页面后重试。首次安装需要刷新已打开的页面。

### Q: 框选模式无响应？
检查页面是否有 CSP (Content Security Policy) 限制，部分网站可能禁止注入脚本。

### Q: 如何卸载？
在扩展管理页面点击 **移除** 按钮。

## 文件说明

```
src/browser-extension/
├── manifest.json    # 扩展配置（权限、入口等）
├── popup.html       # 弹出窗口界面
├── popup.js         # 弹出窗口逻辑
├── content.js       # 注入页面的内容脚本
├── content.css      # 框选样式
└── icons/           # 图标文件
    ├── icon.svg     # 矢量源文件
    ├── icon16.png   # 16x16 图标
    ├── icon48.png   # 48x48 图标
    └── icon128.png  # 128x128 图标
```

## 权限说明

| 权限 | 用途 |
|------|------|
| `activeTab` | 访问当前标签页内容 |
| `scripting` | 注入内容提取脚本 |
| `clipboardWrite` | 复制提取结果到剪贴板 |
| `storage` | 保存历史记录和配置 |

## 隐私声明

- 本扩展完全离线运行，不向任何服务器发送数据
- 提取的内容仅保存在本地浏览器存储中
- 不收集任何用户信息
