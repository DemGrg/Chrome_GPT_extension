document.addEventListener('DOMContentLoaded', function() {
    const saveKeyButton = document.getElementById('save-key');
    const askButton = document.getElementById('ask-question');
    const downloadButton = document.getElementById('download-json');
    const apiKeyInput = document.getElementById('api-key');
    const questionInput = document.getElementById('question');
    const resultDiv = document.getElementById('result');
    const modelSelect = document.getElementById('model-select');
    const temperatureInput = document.getElementById('temperature');
    const copyButton = document.getElementById('copy-result'); // New copy button

    // Load saved API key
    chrome.storage.local.get(['openai_api_key'], function(result) {
      if (result.openai_api_key) {
        apiKeyInput.value = result.openai_api_key;
      }
    });
  
    // Save API key
    saveKeyButton.addEventListener('click', function() {
      const apiKey = apiKeyInput.value;
      chrome.storage.local.set({openai_api_key: apiKey}, function() {
        console.log('API key saved locally');
      });
    });
  
    // Ask question
    askButton.addEventListener('click', function() {
        const question = questionInput.value;
        const selectedModel = modelSelect.value;
        const temperature = parseFloat(temperatureInput.value);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, function(response) {
            if (response && response.content) {
            askOpenAI(question, response.content, selectedModel, temperature);
            }
        });
        });
    });
  
    function askOpenAI(question, pageContent, model, temperature) {
        chrome.storage.local.get(['openai_api_key'], function(result) {
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
              model: model,
              messages: [
                {"role": "system", "content": "You are a preccise helpful assistant. Answer the question based on the given page content."},
                {"role": "user", "content": `Page content: ${pageContent}\n\nQuestion: ${question}`}
              ],
              temperature: temperature
            })
          })
          .then(response => response.json())
          .then(data => {
            if (data.choices && data.choices.length > 0) {
              const answer = data.choices[0].message.content;
              resultDiv.textContent = answer;
              
              // Store the data
              storeData(question, answer, pageContent, model, temperature);
              copyButton.disabled = false;
            } else {
              resultDiv.textContent = "Sorry, I couldn't generate an answer.";
              copyButton.disabled = true;
            }
          })
          .catch(error => {
            resultDiv.textContent = "An error occurred: " + error.message;
          });
        });
      }
    
      function storeData(question, answer, pageContent, model, temperature) {
        chrome.storage.local.get(['storedData'], function(result) {
          let storedData = result.storedData || [];
          storedData.push({
            timestamp: new Date().toISOString(),
            model: model,
            temperature: temperature,
            question: question,
            answer: answer,
            pageContent: pageContent
          });
          chrome.storage.local.set({storedData: storedData}, function() {
            console.log('Data stored');
          });
        });
      }
      
      // Download JSON - Update the download function to use local storage    
      downloadButton.addEventListener('click', function() {
        chrome.storage.local.get(['storedData'], function(result) {
          const dataStr = JSON.stringify(result.storedData || [], null, 2);
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
          
          const exportFileDefaultName = 'openai_extension_data.json';
      
          let linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
        });
      });

      // Copy result
      copyButton.addEventListener('click', function() {
        const textToCopy = resultDiv.textContent;
        navigator.clipboard.writeText(textToCopy).then(function() {
          console.log('Text copied to clipboard');
          // Optionally, you can provide visual feedback to the user
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }).catch(function(err) {
          console.error('Could not copy text: ', err);
        });
      });

      // Initially disable the copy button
      copyButton.disabled = true;
  });