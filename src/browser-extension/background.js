chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-element-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;
      
      chrome.tabs.sendMessage(tabId, { action: 'toggleElementSelection' })
        .catch(() => {
           console.log('Cannot send message to tab', tabId);
        });
    });
  }
});

// 图片下载代理，绕过 CORS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchImage') {
    fetch(request.url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        // 将 Blob 转换为 Base64 字符串返回给 content script
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({ success: true, data: reader.result });
        };
        reader.onerror = () => {
          sendResponse({ success: false, error: 'Failed to read blob' });
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Image fetch failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // 保持消息通道开启以进行异步响应
  }
});