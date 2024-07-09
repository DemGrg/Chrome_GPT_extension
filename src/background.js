chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove('storedData', () => {
    console.log('Stored data cleared on browser startup');
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});