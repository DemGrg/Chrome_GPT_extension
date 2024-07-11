chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.remove('storedData', () => {
      console.log('Stored data cleared on extension install/update');
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove('storedData', () => {
    console.log('Stored data cleared on browser startup');
  });
});