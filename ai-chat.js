/**
 * Nova Skills AI Advisor Chat Controller
 * Communicates strictly with Cloudflare Worker Gateway (/api/ai/chat)
 */

const WORKER_GATEWAY_URL = '/api/ai/chat';

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

async function sendMessage() {
  const inputEl = document.getElementById('userInput');
  const userText = inputEl.value.trim();

  if (!userText) return;

  // Render User Message
  appendMessage(userText, 'user');
  inputEl.value = '';

  // Show Loading Indicator
  const loadingEl = document.getElementById('loadingIndicator');
  loadingEl.style.display = 'block';

  try {
    const response = await fetch(WORKER_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    loadingEl.style.display = 'none';

    if (data.success && data.response) {
      appendMessage(data.response, 'assistant');
    } else {
      appendMessage(data.message || 'Sorry, I am currently unable to process your request. Please contact our admissions team at novaskills.official@gmail.com or call +91 9695904440.', 'assistant');
    }

  } catch (err) {
    loadingEl.style.display = 'none';
    appendMessage('Network error connecting to Nova Skills AI Gateway. Please try again or call admissions at +91 9695904440.', 'assistant');
  }
}

function appendMessage(text, role) {
  const messagesContainer = document.getElementById('chatMessages');
  const msgBubble = document.createElement('div');
  msgBubble.className = `message-bubble ${role}`;

  const textNode = document.createElement('div');
  textNode.innerText = text;
  msgBubble.appendChild(textNode);

  if (role === 'assistant') {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = '📋 Copy Response';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(text);
      copyBtn.innerText = '✅ Copied!';
      setTimeout(() => { copyBtn.innerText = '📋 Copy Response'; }, 2000);
    };
    msgBubble.appendChild(copyBtn);
  }

  messagesContainer.appendChild(msgBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function clearChat() {
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = `
    <div class="message-bubble assistant">
      Hello! I am your Nova Skills AI Advisor. How can I help you today with course details, fees, duration, batch timings, or career guidance?
    </div>
  `;
}
