# SnowClip (雪花剪藏)

**SnowClip** 是一个浏览器扩展，旨在将网页内容转换为大语言模型（LLM）友好的格式（Markdown、JSON、XML）。

## 项目结构

```
web2mcp/
├── src/                      # 源代码
│   └── browser-extension/    # Chrome 浏览器扩展
│       ├── manifest.json     # 扩展配置
│       ├── popup.html        # 弹出界面
│       ├── popup.js          # 弹出逻辑
│       ├── content.js        # 内容提取脚本
│       ├── content.css       # 样式
│       └── icons/            # 图标
├── docs/                     # 文档
│   ├── INSTALL.md            # 安装指南
│   └── EXTENSION.md          # 扩展详细说明
├── scripts/                  # 工具脚本
│   ├── mcp.py                # Python 网页抓取脚本
│   └── generate_icons.py     # 图标生成脚本
├── README.md
├── LICENSE
└── .gitignore
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
4. 选择 `src/browser-extension` 文件夹

详细安装说明请参考 [docs/INSTALL.md](docs/INSTALL.md)

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
