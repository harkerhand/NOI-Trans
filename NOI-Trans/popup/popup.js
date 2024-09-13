// 加载已存储的网页
function loadSavedPages() {
  chrome.storage.local.get(['savedPages'], function (result) {
    const savedPages = result.savedPages || [];
    const savedPagesList = document.getElementById('savedPagesList');
    savedPagesList.innerHTML = ''; // 清空当前列表
    savedPages.forEach((page) => {
      const listItem = document.createElement('li');
      listItem.textContent = `URL: ${page.url}, Element ID: ${page.elementId}`;

      // 添加删除按钮
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        deletePage(page.url);
      });

      listItem.appendChild(deleteButton);
      savedPagesList.appendChild(listItem);
    });
  });
}

// 添加新网页并存储
document.getElementById('addPageButton').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value;
  const elementId = document.getElementById('elementIdInput').value;  // 获取元素ID
  if (url && elementId) {
    chrome.storage.local.get(['savedPages'], function (result) {
      const savedPages = result.savedPages || [];
      // 检查网址是否已经存在
      if (!savedPages.some(page => page.url === url)) {
        savedPages.push({ url, elementId });
        chrome.storage.local.set({ savedPages }, function () {
          loadSavedPages();  // 更新显示
        });
      } else {
        alert('This URL is already saved.');
      }
    });
  } else {
    alert('Please enter a valid URL and Element ID');
  }
});

// 删除指定网页
function deletePage(url) {
  chrome.storage.local.get(['savedPages'], function (result) {
    let savedPages = result.savedPages || [];
    savedPages = savedPages.filter(page => page.url !== url);
    chrome.storage.local.set({ savedPages }, function () {
      loadSavedPages();  // 更新显示
    });
  });
}

// 页面加载时显示已保存的网页
loadSavedPages();
