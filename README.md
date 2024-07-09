# OpenAI GPT Chrome Extension

This Chrome extension leverages OpenAI's GPT models to analyze web page content and answer user questions. It provides a user-friendly interface for interacting with advanced language models directly from your browser.

## Functionality

- **API Key Management**: Securely store your OpenAI API key within the extension.
- **Model Selection**: Choose between GPT-4 and GPT-3.5-turbo models.
- **Temperature Control**: Adjust the randomness of the model's responses.
- **Content Analysis**: Extracts and analyzes the content of the current web page.
- **Question Answering**: Ask questions about the page content and receive AI-generated answers.
- **Data Export**: Download your interaction history as a JSON file.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the `src` directory of this project.

## How to Use

1. Click the extension icon in your Chrome toolbar.
2. Enter your OpenAI API key and click "Save Key".
3. Select the desired model (GPT-4 or GPT-3.5-turbo) from the dropdown.
4. Adjust the temperature value if needed (0 for more deterministic responses, higher for more random).
5. Type your question in the text area.
6. Click "Ask GPT" to get an answer based on the current page's content.
7. View the answer in the popup window.
8. Optionally, click "Download JSON" to export your interaction history.

## ⚠️ Warning and Security Considerations

**IMPORTANT: Please read before use**

1. **API Key Storage**: This extension stores your OpenAI API key in Chrome's local storage. While this is convenient, it's not the most secure method. Consider the following risks:
   - If your computer is compromised, an attacker could potentially access your API key.
   - Other extensions with appropriate permissions might be able to read this data.

2. **Cost Considerations**: Using the OpenAI API incurs costs based on your usage. Be aware of your usage and set appropriate limits on your OpenAI account to avoid unexpected charges.

3. **Data Privacy**: This extension sends web page content to OpenAI's servers for analysis. Do not use it on pages containing sensitive or personal information.

4. **No Encryption**: The API key and interaction data are stored without encryption. Use this extension at your own risk.


## Best Practices

- Use a separate OpenAI API key for this extension with usage limits set to low amount.
- Regularly monitor your OpenAI API usage and costs.
- Avoid using the extension on pages with sensitive information.
- Periodically clear the extension's stored data in Chrome's settings.

## Disclaimer

This extension is provided "as is" without warranty of any kind. The developers are not responsible for any costs, damages, or security issues that may arise from its use.

## License

[MIT License](LICENSE)

---

By using this extension, you acknowledge that you have read and understood these warnings and agree to use the extension at your own risk.
