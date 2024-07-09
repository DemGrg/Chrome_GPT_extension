# OpenAI GPT-4 Extension

This Chrome extension utilizes OpenAI's GPT-4 model to answer questions about the content of the current webpage. It consists of a popup interface where users can input their questions and receive answers based on the page content.

## Functionality

The extension's main functionality:

1. **Content Script (content.js)**: This script runs on every webpage and listens for messages from the background script. When a message is received, it extracts the content of the webpage and sends it back to the background script.


## How to Use

1. Install the extension from the Chrome by enabling Developer Mode and loading src folder as an unpacked extension.
2. Click the extension's icon in the top right corner of the browser.
3. Type your question in the input field and click the "Ask" button.
4. The extension will display the answer based on the content of the current webpage.

## Note

This extension requires an OpenAI API key to function. Please ensure you have an API key and save it in the extension's settings before using it. 

API key is saved in chrome.storage.sync which is not the best practice but it is done for convenience reasons. Use a cap on the API key usage for security reasons. Please use it at your own risk.
