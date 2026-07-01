/* =========================================================
   AgriSphere AI — chatbot.js
   AI Farming Assistant page logic
   - Sends/receives chat messages (dummy AI responses only)
   - Simulated typing indicator before AI reply appears
   - Suggested question chips auto-fill + send
   - Voice button UI toggle (no real speech recognition wired up)
   - Chat History sidebar (in-memory, dummy sessions)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- ELEMENT REFERENCES ---------------- */
  const chatMessages   = document.getElementById('chatMessages');
  const chatInput      = document.getElementById('chatInput');
  const sendBtn        = document.getElementById('sendBtn');
  const voiceBtn       = document.getElementById('voiceBtn');
  const voiceIcon      = document.getElementById('voiceIcon');
  const newChatBtn     = document.getElementById('newChatBtn');
  const chatHistoryList = document.getElementById('chatHistoryList');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  /* ---------------- DUMMY AI RESPONSE BANK ---------------- */
  // Keyword-matched canned responses to simulate an intelligent assistant.
  // No real backend / AI model is called — purely for demo purposes.
  const dummyResponses = [
    {
      keywords: ['crop', 'plant', 'season', 'sow'],
      reply: "Based on this season's soil moisture and temperature trends, I'd recommend planting Wheat or Mustard. Both show strong yield potential for your region right now. 🌾"
    },
    {
      keywords: ['water', 'irrigat', 'gauge'],
      reply: "Your field's current soil moisture is at 42%. I recommend irrigating with approximately 35mm of water early morning for best absorption. 💧"
    },
    {
      keywords: ['rain', 'weather', 'forecast', 'climate'],
      reply: "Looking at this week's forecast, there's a 60% chance of light rainfall on Thursday. You may want to hold off on fertilizer application until after that. 🌦️"
    },
    {
      keywords: ['price', 'market', 'sell', 'wheat', 'rate'],
      reply: "Wheat is currently trading at ₹2,150/quintal, up 3.2% from last week. Nearby mandis are showing similar upward trends. 📈"
    },
    {
      keywords: ['disease', 'pest', 'leaf', 'infection'],
      reply: "From common symptoms you've described, this could be early-stage leaf blight. I'd suggest uploading a photo on the Disease Detection page for a more accurate diagnosis. 🩺"
    },
    {
      keywords: ['soil', 'fertilizer', 'nutrient', 'ph'],
      reply: "Your last soil report showed slightly low Nitrogen levels. A balanced NPK fertilizer (recommended ratio 20:10:10) should help improve crop health. 🧪"
    },
    {
      keywords: ['hello', 'hi', 'hey', 'namaste'],
      reply: "Hello! 👋 How can I help you with your farm today?"
    }
  ];

  // Fallback reply when no keywords match
  const fallbackReply = "That's a great question! Based on general best practices, I'd recommend monitoring your field conditions closely and checking the Soil, Weather, and Irrigation tabs for more tailored insights. 🌱";

  /* ---------------- CHAT HISTORY (dummy, in-memory sessions) ---------------- */
  let historySessions = [
    { id: 1, title: 'Wheat planting advice' },
    { id: 2, title: 'Irrigation schedule query' },
    { id: 3, title: 'Leaf spot diagnosis' }
  ];
  let activeSessionId = 1;

  // Render the chat history list in the sidebar
  function renderChatHistory() {
    chatHistoryList.innerHTML = '';
    historySessions.forEach(session => {
      const li = document.createElement('li');
      li.className = 'chat-history__item' +
        (session.id === activeSessionId ? ' chat-history__item--active' : '');
      li.textContent = session.title;
      li.dataset.sessionId = session.id;

      // Clicking a history item just marks it active (dummy — no real session switching logic)
      li.addEventListener('click', () => {
        activeSessionId = session.id;
        renderChatHistory();
      });

      chatHistoryList.appendChild(li);
    });
  }
  renderChatHistory();

  // "+ New" button starts a fresh dummy session and clears the chat window
  newChatBtn.addEventListener('click', () => {
    const newId = historySessions.length + 1;
    const newSession = { id: newId, title: 'New conversation' };
    historySessions.unshift(newSession);
    activeSessionId = newId;
    renderChatHistory();

    // Reset chat window to initial greeting
    chatMessages.innerHTML = `
      <div class="chat-msg chat-msg--ai">
        <div class="chat-msg__avatar">🤖</div>
        <div class="chat-msg__bubble">
          <p>Namaste 🙏 I'm your AgriSphere AI Assistant. Ask me anything about farming!</p>
        </div>
      </div>`;
  });

  /* ---------------- MESSAGE RENDERING HELPERS ---------------- */

  // Appends a user message bubble to the chat window
  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--user';
    msg.innerHTML = `
      <div class="chat-msg__avatar">🧑‍🌾</div>
      <div class="chat-msg__bubble"><p>${escapeHTML(text)}</p></div>
    `;
    chatMessages.appendChild(msg);
    scrollToBottom();
  }

  // Appends an AI message bubble to the chat window
  function appendAIMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--ai';
    msg.innerHTML = `
      <div class="chat-msg__avatar">🤖</div>
      <div class="chat-msg__bubble"><p>${text}</p></div>
    `;
    chatMessages.appendChild(msg);
    scrollToBottom();
  }

  // Shows a temporary "typing..." bubble with animated dots, returns the element
  // so it can be removed once the real reply is ready.
  function showTypingIndicator() {
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg chat-msg--ai';
    typingMsg.id = 'typingIndicator';
    typingMsg.innerHTML = `
      <div class="chat-msg__avatar">🤖</div>
      <div class="chat-msg__bubble chat-msg__bubble--typing">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(typingMsg);
    scrollToBottom();
    return typingMsg;
  }

  // Basic HTML escape to keep user input safe when injected via innerHTML
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Auto-scrolls the chat window to the latest message
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* ---------------- DUMMY AI REPLY LOGIC ---------------- */

  // Picks a canned reply based on simple keyword matching against the user's message
  function getDummyReply(userText) {
    const lowerText = userText.toLowerCase();
    const match = dummyResponses.find(item =>
      item.keywords.some(keyword => lowerText.includes(keyword))
    );
    return match ? match.reply : fallbackReply;
  }

  /* ---------------- SEND MESSAGE FLOW ---------------- */

  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    chatInput.value = '';

    // Update the active history session title with the first message (dummy UX touch)
    const session = historySessions.find(s => s.id === activeSessionId);
    if (session && session.title === 'New conversation') {
      session.title = text.length > 28 ? text.slice(0, 28) + '…' : text;
      renderChatHistory();
    }

    // Simulate "AI thinking" delay with typing indicator before responding
    const typingEl = showTypingIndicator();
    const thinkDelay = 900 + Math.random() * 700; // 0.9s–1.6s randomized delay

    setTimeout(() => {
      typingEl.remove();
      appendAIMessage(getDummyReply(text));
    }, thinkDelay);
  }

  // Send button click
  sendBtn.addEventListener('click', handleSendMessage);

  // Enter key sends message
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  /* ---------------- SUGGESTED QUESTIONS ---------------- */
  // Clicking a suggestion chip fills the input and immediately sends it
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.dataset.question;
      handleSendMessage();
    });
  });

  /* ---------------- VOICE BUTTON (UI ONLY) ---------------- */
  // No real speech-to-text is wired up — this purely toggles a "listening" visual
  // state for demo purposes, then auto-resets after a couple seconds.
  let isListening = false;

  voiceBtn.addEventListener('click', () => {
    isListening = !isListening;

    if (isListening) {
      voiceBtn.classList.add('chat-icon-btn--listening');
      voiceIcon.textContent = '⏺️';
      chatInput.placeholder = 'Listening...';

      // Auto-stop "listening" after 2.5s and drop in a dummy transcribed message
      setTimeout(() => {
        isListening = false;
        voiceBtn.classList.remove('chat-icon-btn--listening');
        voiceIcon.textContent = '🎤';
        chatInput.placeholder = 'Type your farming question...';
        chatInput.value = 'How is my crop health looking today?';
      }, 2500);

    } else {
      voiceBtn.classList.remove('chat-icon-btn--listening');
      voiceIcon.textContent = '🎤';
      chatInput.placeholder = 'Type your farming question...';
    }
  });

});
