document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    const userInput = document.querySelector('#user-input');
    const sendButton = document.querySelector('#send-button');
    const chatLog = document.querySelector('#chat-log');
  
    function createMessageElement(message, isUserMessage) {
      const messageWrapper = document.createElement('div');
      messageWrapper.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-4');
  
      if (isUserMessage) {
        messageWrapper.classList.add('justify-content-end');
      }
  
      const avatar = document.createElement('img');
      avatar.setAttribute('style', 'width: 45px; height: 100%;');
      avatar.src = isUserMessage
        ? 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp'
        : 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp';
      if (isUserMessage) {
        messageWrapper.appendChild(avatar);
      }
  
      const messageElement = document.createElement('div');
      const messageText = document.createElement('p');
      messageText.classList.add('small', 'p-2', 'ms-3', 'mb-1', 'rounded-3');
      messageText.style.backgroundColor = isUserMessage ? '#17a2b8' : '#f5f6f7';
      messageText.style.color = isUserMessage ? 'white' : 'black';
      messageText.innerText = message;
      messageElement.appendChild(messageText);
  
      const messageTime = document.createElement('p');
      messageTime.classList.add('small', 'ms-3', 'mb-3', 'rounded-3', 'text-muted');
      messageTime.innerText = new Date().toLocaleTimeString().slice(0, -3);
      messageElement.appendChild(messageTime);
  
      if (!isUserMessage) {
        messageWrapper.appendChild(avatar);
      }
      messageWrapper.appendChild(messageElement);
      return messageWrapper;
    }
  
    function addMessageToChatLog(message, isUserMessage) {
      const messageElement = createMessageElement(message, isUserMessage);
      chatLog.appendChild(messageElement);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  
    async function handleUserMessage() {
      const message = userInput.value.trim();
      if (message === '') return;
  
      addMessageToChatLog(message, true);
      userInput.value = '';
  
      const response = await fetch('/send_message', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
  
      const data = await response.json();
      addMessageToChatLog(data.response, false);
    }
  
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`);
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    });
  });
  