import md5 from 'md5';

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = tab.url;

    // 检查该URL是否在已存储的网页列表中
    chrome.storage.local.get(['savedPages'], (result) => {
      const savedPages = result.savedPages || [];

      // 遍历所有存储的URL，并检查是否匹配当前打开的URL
      const matchedPage = savedPages.find((savedPage) => {
        return isWildcardMatch(url, savedPage.url);  // 检查URL匹配
      });

      if (matchedPage) {
        // 如果URL匹配存储的通配符URL，执行翻译逻辑，传入对应的elementId
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: translate,
          args: [matchedPage.elementId] // 传入存储的elementId
        });
      }
    });
  }
});


// 匹配通配符URL
function isWildcardMatch(url, wildcardUrl) {
  const regexPattern = wildcardUrl
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
}

// 处理来自内容脚本的翻译请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'md5') {
    const md5Text = md5(message.text);
    sendResponse({ md5Text });
  }
  return true;  // 保证异步消息处理
});


async function translate(elementId) {
  let pageTitleElement = document.getElementById(elementId);

  if (pageTitleElement) {
    let originalText = pageTitleElement.innerText;

    try {
      let translatedText = await trans(originalText);  // 等待翻译结果
      pageTitleElement.innerHTML = `<h2>${translatedText}</h2>`;
    } catch (error) {
      console.error("Translation failed:", error);
    }
  } else {
    console.log("未找到页面标题元素");
  }

  async function trans(originalText) {
    const appid = '20240911002147778';
    const key = 'AaYsHo7Fs5dtURwYi9hq';
    const salt = (new Date()).getTime();
    const from = 'auto';
    const to = 'en';

    const sign = await getMd5(appid + originalText + salt + key);  // 获取 MD5 签名

    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(originalText)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
    console.log(url);

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      return result.trans_result[0].dst;
    } catch (error) {
      throw new Error("Error fetching translation: " + error);
    }
  }

  function getMd5(str) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "md5", text: str }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response.md5Text);
        }
      });
    });
  }
}
