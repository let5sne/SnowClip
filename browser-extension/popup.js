document.addEventListener('DOMContentLoaded', () => {
  const selectBtn = document.getElementById('selectBtn');
  const fullPageBtn = document.getElementById('fullPageBtn');
  const copyLastBtn = document.getElementById('copyLastBtn');
  const formatSelect = document.getElementById('formatSelect');
  const status = document.getElementById('status');

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => {
      status.className = 'status';
    }, 3000);
  }

  // 框选区域提取
  selectBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const format = formatSelect.value;
    
    await chrome.tabs.sendMessage(tab.id, { 
      action: 'startSelection',
      format: format
    });
    
    window.close();
  });

  // 提取整页内容
  fullPageBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const format = formatSelect.value;
    
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'extractFullPage',
        format: format
      });
      
      if (response && response.success) {
        showStatus('✅ 内容已复制到剪贴板', 'success');
      } else {
        showStatus('❌ 提取失败', 'error');
      }
    } catch (err) {
      showStatus('❌ 请刷新页面后重试', 'error');
    }
  });

  // 复制上次结果
  copyLastBtn.addEventListener('click', async () => {
    const result = await chrome.storage.local.get('lastExtraction');
    if (result.lastExtraction) {
      await navigator.clipboard.writeText(result.lastExtraction);
      showStatus('✅ 已复制上次结果', 'success');
    } else {
      showStatus('❌ 暂无历史记录', 'error');
    }
  });

  // 恢复上次选择的格式
  chrome.storage.local.get('format', (result) => {
    if (result.format) {
      formatSelect.value = result.format;
    }
  });

  // 保存格式选择
  formatSelect.addEventListener('change', () => {
    chrome.storage.local.set({ format: formatSelect.value });
  });
});
