document.addEventListener('DOMContentLoaded', function() {
    const saveKeyButton = document.getElementById('save-key');
    const askButton = document.getElementById('ask-question');
    const apiKeyInput = document.getElementById('api-key');
    const questionInput = document.getElementById('question');
    const resultDiv = document.getElementById('result');
  
    // Load saved API key
    chrome.storage.sync.get(['openai_api_key'], function(result) {
      if (result.openai_api_key) {
        apiKeyInput.value = result.openai_api_key;
      }
    });
  
    // Save API key
    saveKeyButton.addEventListener('click', function() {
      const apiKey = apiKeyInput.value;
      chrome.storage.sync.set({openai_api_key: apiKey}, function() {
        console.log('API key saved');
      });
    });
  
    // Ask question
    askButton.addEventListener('click', function() {
      const question = questionInput.value;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
          if (response && response.content) {
            askOpenAI(question, response.content);
          }
        });
      });
    });
  
    function askOpenAI(question, pageContent) {
      chrome.storage.sync.get(['openai_api_key'], function(result) {
        if (!result.openai_api_key) {
          resultDiv.textContent = "Please save your OpenAI API key first.";
          return;
        }
  
        resultDiv.textContent = "Loading...";
  
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.openai_api_key}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {"role": "system", "content": "You are a helpful assistant. Answer the question based on the given page content."},
              {"role": "user", "content": `Page content: ${pageContent}\n\nQuestion: ${question}`}
            ]
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.choices && data.choices.length > 0) {
            resultDiv.textContent = data.choices[0].message.content;
          } else {
            resultDiv.textContent = "Sorry, I couldn't generate an answer.";
          }
        })
        .catch(error => {
          resultDiv.textContent = "An error occurred: " + error.message;
        });
      });
    }
  });