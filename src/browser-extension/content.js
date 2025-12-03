// 全局变量
let isSelecting = false;
let selectionBox = null;
let startX, startY;
let overlay = null;
let currentFormat = 'markdown';

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSelection') {
    currentFormat = request.format || 'markdown';
    startSelectionMode();
    sendResponse({ success: true });
  } else if (request.action === 'extractFullPage') {
    currentFormat = request.format || 'markdown';
    const content = extractContent(document.body);
    const formatted = formatContent(content, currentFormat);
    copyToClipboard(formatted);
    saveToStorage(formatted);
    sendResponse({ success: true });
  } else if (request.action === 'toggleElementSelection') {
    // 如果已经在选择模式，则退出
    if (isSelecting) {
      cleanup();
    } else {
      // 默认格式或者读取存储的格式? 这里暂时用默认markdown
      // 理想情况应该从 storage 读取，这里简化处理
      chrome.storage.local.get('format', (res) => {
        currentFormat = res.format || 'markdown';
        startElementSelectionMode();
      });
    }
    sendResponse({ success: true });
  }
  return true;
});

// === 元素选择模式 ===
let highlightBox = null;
let lastTarget = null;

function startElementSelectionMode() {
  isSelecting = true;
  
  // 创建提示
  const hint = document.createElement('div');
  hint.className = 'llm-extractor-hint';
  hint.textContent = '移动鼠标选择元素，点击提取，ESC 取消';
  document.body.appendChild(hint);
  
  // 创建高亮框
  highlightBox = document.createElement('div');
  highlightBox.className = 'llm-extractor-element-highlight';
  highlightBox.style.display = 'none';
  document.body.appendChild(highlightBox);
  
  // 绑定事件
  document.addEventListener('mousemove', onElementMouseMove, true);
  document.addEventListener('click', onElementClick, true);
  document.addEventListener('keydown', onKeyDown);
}

function onElementMouseMove(e) {
  if (!isSelecting) return;
  
  const target = document.elementFromPoint(e.clientX, e.clientY);
  
  if (target && target !== lastTarget && target !== highlightBox && !target.classList.contains('llm-extractor-hint')) {
    lastTarget = target;
    
    const rect = target.getBoundingClientRect();
    highlightBox.style.display = 'block';
    highlightBox.style.left = rect.left + 'px';
    highlightBox.style.top = rect.top + 'px';
    highlightBox.style.width = rect.width + 'px';
    highlightBox.style.height = rect.height + 'px';
  }
}

function onElementClick(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  if (lastTarget) {
    // 提取内容
    const content = extractContent(lastTarget);
    const formatted = formatContent(content, currentFormat);
    
    copyToClipboard(formatted);
    saveToStorage(formatted);
    showNotification('✅ 元素内容已提取');
  }
  
  cleanup();
}

// === 框选模式 ===
// 开始框选模式
function startSelectionMode() {
  isSelecting = true;
  
  // 创建遮罩层
  overlay = document.createElement('div');
  overlay.className = 'llm-extractor-overlay';
  document.body.appendChild(overlay);
  
  // 创建提示
  const hint = document.createElement('div');
  hint.className = 'llm-extractor-hint';
  hint.textContent = '拖拽鼠标框选要提取的区域，ESC 取消';
  document.body.appendChild(hint);
  
  // 绑定事件
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('keydown', onKeyDown);
}

function onMouseDown(e) {
  if (!isSelecting) return;
  
  startX = e.clientX;
  startY = e.clientY;
  
  // 创建选择框
  selectionBox = document.createElement('div');
  selectionBox.className = 'llm-extractor-selection';
  selectionBox.style.left = startX + 'px';
  selectionBox.style.top = startY + 'px';
  document.body.appendChild(selectionBox);
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
  if (!selectionBox) return;
  
  const currentX = e.clientX;
  const currentY = e.clientY;
  
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  
  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
}

function onMouseUp(e) {
  if (!selectionBox) return;
  
  const rect = selectionBox.getBoundingClientRect();
  
  // 清理选择框
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  
  // 查找选区内的元素
  const elements = getElementsInRect(rect);
  
  if (elements.length > 0) {
    // 提取内容
    const content = extractFromElements(elements);
    const formatted = formatContent(content, currentFormat);
    
    copyToClipboard(formatted);
    saveToStorage(formatted);
    showNotification('✅ 内容已提取并复制到剪贴板');
  } else {
    showNotification('❌ 未选中任何内容');
  }
  
  cleanup();
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    cleanup();
  }
}

function cleanup() {
  isSelecting = false;
  lastTarget = null;
  
  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
  
  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }
  
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
  
  const hint = document.querySelector('.llm-extractor-hint');
  if (hint) hint.remove();
  
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  
  document.removeEventListener('mousemove', onElementMouseMove, true);
  document.removeEventListener('click', onElementClick, true);
  
  document.removeEventListener('keydown', onKeyDown);
}

// 获取选区内的元素
function getElementsInRect(rect) {
  const elements = [];
  const allElements = document.body.querySelectorAll('*');
  
  allElements.forEach(el => {
    const elRect = el.getBoundingClientRect();
    if (isRectOverlap(rect, elRect) && isVisibleElement(el)) {
      elements.push(el);
    }
  });
  
  // 找到最小公共祖先
  if (elements.length > 0) {
    return [findCommonAncestor(elements)];
  }
  
  return elements;
}

function isRectOverlap(rect1, rect2) {
  return !(rect1.right < rect2.left || 
           rect1.left > rect2.right || 
           rect1.bottom < rect2.top || 
           rect1.top > rect2.bottom);
}

function isVisibleElement(el) {
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
}

function findCommonAncestor(elements) {
  if (elements.length === 1) return elements[0];
  
  let ancestor = elements[0];
  for (let i = 1; i < elements.length; i++) {
    ancestor = findAncestor(ancestor, elements[i]);
  }
  return ancestor;
}

function findAncestor(el1, el2) {
  const ancestors = [];
  let node = el1;
  while (node) {
    ancestors.push(node);
    node = node.parentElement;
  }
  
  node = el2;
  while (node) {
    if (ancestors.includes(node)) return node;
    node = node.parentElement;
  }
  
  return document.body;
}

// 从元素中提取内容
function extractFromElements(elements) {
  const content = [];
  elements.forEach(el => {
    content.push(...extractContent(el));
  });
  return content;
}

// 提取内容
function extractContent(root) {
  const content = [];
  const processed = new Set();
  
  function processElement(el) {
    if (processed.has(el)) return;
    
    const tagName = el.tagName?.toLowerCase();
    
    // 跳过不需要的元素
    if (['script', 'style', 'noscript', 'iframe', 'svg'].includes(tagName)) {
      return;
    }
    
    // 标题
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      processed.add(el);
      content.push({
        type: 'heading',
        level: parseInt(tagName[1]),
        content: el.textContent.trim()
      });
      return;
    }
    
    // 段落
    if (tagName === 'p') {
      const text = el.textContent.trim();
      if (text) {
        processed.add(el);
        content.push({
          type: 'paragraph',
          content: text
        });
      }
      return;
    }
    
    // 代码块
    if (tagName === 'pre' || tagName === 'code') {
      if (tagName === 'pre' || !el.closest('pre')) {
        processed.add(el);
        const lang = el.className.match(/language-(\w+)/)?.[1] || 
                     el.getAttribute('data-lang') || '';
        content.push({
          type: 'code',
          language: lang,
          content: el.textContent
        });
      }
      return;
    }
    
    // 列表
    if (tagName === 'ul' || tagName === 'ol') {
      processed.add(el);
      const items = Array.from(el.querySelectorAll(':scope > li'))
        .map(li => li.textContent.trim())
        .filter(Boolean);
      if (items.length) {
        content.push({
          type: 'list',
          ordered: tagName === 'ol',
          items: items
        });
      }
      return;
    }
    
    // 表格
    if (tagName === 'table') {
      processed.add(el);
      const rows = Array.from(el.querySelectorAll('tr')).map(tr => {
        return Array.from(tr.querySelectorAll('th, td'))
          .map(cell => cell.textContent.trim());
      });
      if (rows.length) {
        content.push({
          type: 'table',
          rows: rows
        });
      }
      return;
    }
    
    // 图片
    if (tagName === 'img') {
      processed.add(el);
      content.push({
        type: 'image',
        src: el.src,
        alt: el.alt || ''
      });
      return;
    }
    
    // 链接
    if (tagName === 'a') {
      processed.add(el);
      const text = el.textContent.trim();
      if (text) {
        content.push({
          type: 'link',
          text: text,
          href: el.href
        });
      }
      return;
    }
    
    // 递归处理子元素
    Array.from(el.children).forEach(child => processElement(child));
  }
  
  processElement(root);
  
  // 如果没有提取到结构化内容，回退到纯文本
  if (content.length === 0) {
    const text = root.textContent.trim();
    if (text) {
      content.push({
        type: 'paragraph',
        content: text
      });
    }
  }
  
  return content;
}

// 格式化内容
function formatContent(content, format) {
  switch (format) {
    case 'markdown':
      return toMarkdown(content);
    case 'json':
      return JSON.stringify(content, null, 2);
    case 'xml':
      return toXML(content);
    default:
      return toMarkdown(content);
  }
}

// 转换为 Markdown
function toMarkdown(content) {
  return content.map(item => {
    switch (item.type) {
      case 'heading':
        return '#'.repeat(item.level) + ' ' + item.content + '\n';
      
      case 'paragraph':
        return item.content + '\n';
      
      case 'code':
        const lang = item.language || '';
        return '```' + lang + '\n' + item.content + '\n```\n';
      
      case 'list':
        return item.items.map((text, i) => {
          const prefix = item.ordered ? `${i + 1}. ` : '- ';
          return prefix + text;
        }).join('\n') + '\n';
      
      case 'table':
        if (item.rows.length === 0) return '';
        const header = '| ' + item.rows[0].join(' | ') + ' |';
        const separator = '| ' + item.rows[0].map(() => '---').join(' | ') + ' |';
        const body = item.rows.slice(1)
          .map(row => '| ' + row.join(' | ') + ' |')
          .join('\n');
        return [header, separator, body].filter(Boolean).join('\n') + '\n';
      
      case 'image':
        return `![${item.alt}](${item.src})\n`;
      
      case 'link':
        return `[${item.text}](${item.href})\n`;
      
      default:
        return '';
    }
  }).join('\n');
}

// 转换为 XML
function toXML(content) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<document>\n';
  
  content.forEach(item => {
    switch (item.type) {
      case 'heading':
        xml += `  <heading level="${item.level}">${escapeXML(item.content)}</heading>\n`;
        break;
      case 'paragraph':
        xml += `  <paragraph>${escapeXML(item.content)}</paragraph>\n`;
        break;
      case 'code':
        xml += `  <code language="${item.language || ''}">${escapeXML(item.content)}</code>\n`;
        break;
      case 'list':
        xml += `  <list ordered="${item.ordered}">\n`;
        item.items.forEach(text => {
          xml += `    <item>${escapeXML(text)}</item>\n`;
        });
        xml += '  </list>\n';
        break;
      case 'table':
        xml += '  <table>\n';
        item.rows.forEach((row, i) => {
          xml += `    <row index="${i}">\n`;
          row.forEach((cell, j) => {
            xml += `      <cell index="${j}">${escapeXML(cell)}</cell>\n`;
          });
          xml += '    </row>\n';
        });
        xml += '  </table>\n';
        break;
      case 'image':
        xml += `  <image src="${escapeXML(item.src)}" alt="${escapeXML(item.alt)}"/>\n`;
        break;
      case 'link':
        xml += `  <link href="${escapeXML(item.href)}">${escapeXML(item.text)}</link>\n`;
        break;
    }
  });
  
  xml += '</document>';
  return xml;
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// 保存到 storage
function saveToStorage(text) {
  chrome.storage.local.set({ lastExtraction: text });
}

// 显示通知
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'llm-extractor-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}
