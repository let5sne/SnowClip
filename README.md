# Web2MCP

将网页内容转换为大模型友好格式的工具集。

## 项目结构

```
web2mcp/
├── browser-extension/    # Chrome 浏览器扩展
│   ├── manifest.json     # 扩展配置
│   ├── popup.html        # 弹出界面
│   ├── popup.js          # 弹出逻辑
│   ├── content.js        # 内容提取脚本
│   ├── content.css       # 样式
│   └── icons/            # 图标
├── mcp.py                # Python 网页抓取脚本
└── README.md
```

## 功能

### 浏览器扩展

一个 Chrome 扩展，用于截取网页内容并转换为结构化格式。

**特性：**
- 🎯 区域框选提取
- 📄 整页内容提取
- 📝 多格式输出（Markdown / JSON / XML）
- 📋 自动复制到剪贴板

**安装：**
1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择 `browser-extension` 文件夹

### Python 脚本

用于抓取网页并提取结构化内容。

```bash
python mcp.py
```

## 输出格式示例

### Markdown
```markdown
# 标题

这是一段文字内容。

- 列表项 1
- 列表项 2
```

### JSON
```json
[
  {
    "type": "heading",
    "level": 1,
    "content": "标题"
  },
  {
    "type": "paragraph",
    "content": "这是一段文字内容。"
  }
]
```

## 依赖

**Python：**
```bash
pip install requests beautifulsoup4
```

## License

[MIT](LICENSE)
