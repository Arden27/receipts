document.addEventListener("DOMContentLoaded", () => {
    const chatOutput = document.getElementById("chat-output");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");

    // Function to send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            chatInput.value = "";
            appendMessage("user-message", message);
            fetch(`/?prompt=${encodeURIComponent(message)}`)
                .then((response) => response.json())
                .then((data) => {
                    appendMessage("bot-message", data.response);
                });
        }
    }

    // Event listener for the "Enter" key
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // Event listener for the "Send" button
    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    function appendMessage(className, message) {
        const messageElement = document.createElement("div");
        messageElement.className = `chat-message ${className}`;
        messageElement.textContent = message;
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    /* focus on input field */
    /*
    function focusInputField() {
        chatInput.focus();
    }
    document.addEventListener("DOMContentLoaded", focusInputField);
    */
});