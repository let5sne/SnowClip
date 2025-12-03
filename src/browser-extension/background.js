chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-element-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;
      
      // 尝试发送消息，如果失败可能是页面未加载content script
      chrome.tabs.sendMessage(tabId, { action: 'toggleElementSelection' })
        .catch(() => {
           // 可以选择注入脚本或忽略
           console.log('Cannot send message to tab', tabId);
        });
    });
  }
});
