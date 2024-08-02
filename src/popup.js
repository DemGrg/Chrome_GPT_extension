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
    const clearJsonButton = document.getElementById('clear-json'); // New clear JSON button

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
  
    function askOpenAI(question, transcript, model, temperature) {
      chrome.storage.local.get(['openai_api_key'], function(result) {
        if (!result.openai_api_key) {
          resultDiv.textContent = "Please save your OpenAI API key first.";
          return;
        }
  
        resultDiv.textContent = "Loading...";

        // If question is empty, set it to "None"
        const userQuestion = question.trim() === '' ? 'None' : question;

        const charLimit = model === 'gpt-3.5-turbo' ? 10000 : 100000;

        let truncatedContent;
        if (transcript.length > charLimit) {
          truncatedContent = transcript.substring(0, charLimit) + "... (content truncated)";
          resultDiv.textContent = `Transcript exceeded ${charLimit} characters and was truncated. Processing...`;
        } else {
          truncatedContent = transcript;
        }
  
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.openai_api_key}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                "role": "system",
                "content": "You are a helpful and precise summary assistant. Analyze the given Web content and provide the following:\n1. A short, precise title for the Web content (max 10 words)\n2. A brief, precise overall summary in 1-2 sentences\n3. Key bullet notes for every 10 minutes of content, focusing on key insights and notions. Highlight specific points, comparisons, and important data from the text (e.g., Spacecraft A is the fastest, Spacecraft B is the sturdiest). Extract key insights and facts. core example: you are not summarizing like (something is demonstrated), but providing notes (demonstration show performance in A if used in B format). always provide some core note about a conclusion if it can be extracted. \n4. User's question (if provided)\n5. An answer to the user's question with key facts extracted from the transcript (if a question is provided).\n\nFormat your response using these exact headings: Title:, Overall Summary:, Key Bullet Notes:, User Question(if provided):, Question Answer(if user question is provided): \n\nBy adhering to these instructions, ensure that the final output is clear, concise, and accurately reflects the key information from the transcript, while omitting any unnecessary sections if no user question is present."
            },
            {
                "role": "user",
                "content": `Web content:\n${transcript}\n\nUser Question: ${userQuestion}`
            }
            ],
            temperature: temperature
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.choices && data.choices.length > 0) {
            const answer = data.choices[0].message.content;
            resultDiv.textContent = answer;
            
            storeData(question, answer, truncatedContent, model, temperature);
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
    
      function storeData(question, answer, truncatedContent, model, temperature) {
        chrome.storage.local.get(['storedData'], function(result) {
          let storedData = result.storedData || [];
          storedData.push({
            timestamp: new Date().toISOString(),
            model: model,
            temperature: temperature,
            question: question,
            answer: answer,
            pageContent: truncatedContent
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

          // Clear JSON data
      clearJsonButton.addEventListener('click', function() {
        chrome.storage.local.remove('storedData', function() {
            console.log('Stored data cleared');
            alert('JSON data has been cleared.');
        } );
       });

      // Initially disable the copy button
      copyButton.disabled = true;
  });