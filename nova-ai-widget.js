/**
 * Nova Skills Enterprise Platform — Floating AI Career Advisor Widget
 * Version: 2.0.0
 * Pure JavaScript & Glassmorphism UI Widget
 */

(function () {
  'use strict';

  const WORKER_AI_ENDPOINT = '/api/ai/chat';
  const STORAGE_KEY_HISTORY = 'novaskills_ai_history';
  const STORAGE_KEY_USER = 'novaskills_user';

  let chatHistory = [];
  let isPanelOpen = false;
  let isGenerating = false;

  // Knowledge base responses for instant fallback / local advisor capability
  const KNOWLEDGE_RESPONSES = {
    'digital marketing': "Our **Digital Marketing Master Program** (3 Months) covers SEO, Google Ads, Meta Ads (Facebook & Instagram), Content Strategy, Email Marketing, and Web Analytics. Includes 100% practical projects, Google & Meta Certifications, and dedicated placement assistance! Would you like to view fees or book a free counselling session?",
    'graphic design': "Our **Graphic Design Professional Course** (3 Months) teaches Adobe Photoshop, Illustrator, Figma, and Canva. You'll build a live creative portfolio for branding, social media graphics, and UI design. Includes placement support and certificate! Want to see batch timings?",
    'website development': "Our **Full-Stack Web Development Course** (6 Months) covers HTML5, CSS3, JavaScript, React.js, Node.js, and Supabase database integration. Learn to build real-world web apps with hands-on projects and placement guarantee! Would you like to check eligibility?",
    'video editing': "Our **Motion Graphics & Video Editing Course** (3 Months) covers Premiere Pro, After Effects, and AI video creation tools. Perfect for content creators and YouTube editors. Includes portfolio creation and placement support!",
    'fees': "Course fees at Nova Skills start from ₹15,000 to ₹45,000 depending on the program. We offer **Flexible No-Cost EMI options** and merit-based scholarships! Would you like our counsellor to share the detailed fee structure for a specific course?",
    'placement': "Nova Skills offers **100% Dedicated Placement Support**! We have hiring partnerships with 150+ top companies. Services include resume building, mock interviews, LinkedIn optimization, and guaranteed job interviews. Over 5,000+ students placed!",
    'admission': "The admission process is very simple:\n1. Choose your desired course.\n2. Attend a **Free 1-on-1 Career Counselling Session**.\n3. Complete registration and select your preferred morning/evening batch.",
    'batch': "We offer flexible learning modes:\n• **Morning Batches**: 9:00 AM – 11:00 AM & 11:30 AM – 1:30 PM\n• **Evening Batches**: 4:00 PM – 6:00 PM & 6:30 PM – 8:30 PM\n• **Weekend Batches**: Available for working professionals.\nClassroom and Live Online modes available!"
  };

  function trackEvent(eventName, payload = {}) {
    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...payload });
    }
    console.log(`[Nova AI Analytics] ${eventName}`, payload);
  }

  function getUserProfile() {
    try {
      const u = localStorage.getItem(STORAGE_KEY_USER);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function injectWidgetStyles() {
    if (document.getElementById('nova-ai-styles')) return;
    const style = document.createElement('style');
    style.id = 'nova-ai-styles';
    style.textContent = `
      /* Floating Action Button */
      .nova-ai-float-btn {
        position: fixed;
        bottom: 104px;
        right: 32px;
        z-index: 999990;
        background: linear-gradient(135deg, #0599a8 0%, #011731 100%);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 50px;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 32px rgba(5, 153, 168, 0.35);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation: floatPulse 3s ease-in-out infinite;
      }
      .nova-ai-float-btn:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 16px 48px rgba(5, 153, 168, 0.5);
        border-color: #38bdf8;
      }
      .nova-ai-pulse-dot {
        width: 8px;
        height: 8px;
        background: #38bdf8;
        border-radius: 50%;
        box-shadow: 0 0 10px #38bdf8;
      }

      /* Floating Chat Panel */
      .nova-ai-panel {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 400px;
        height: 620px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 64px);
        z-index: 999995;
        background: rgba(1, 23, 49, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 20px;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .nova-ai-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* Chat Header */
      .nova-ai-header {
        background: rgba(5, 153, 168, 0.15);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nova-ai-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .nova-ai-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0599a8, #38bdf8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        position: relative;
      }
      .nova-ai-status-online {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background: #4ade80;
        border: 2px solid #011731;
        border-radius: 50%;
      }
      .nova-ai-header-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }
      .nova-ai-header-sub {
        font-size: 0.75rem;
        color: #94a3b8;
        margin-top: 2px;
      }
      .nova-ai-header-controls {
        display: flex;
        gap: 8px;
      }
      .nova-ai-icon-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 4px 8px;
        border-radius: 6px;
        transition: color 0.2s;
      }
      .nova-ai-icon-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }

      /* Messages Area */
      .nova-ai-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .nova-ai-message {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 14px;
        font-size: 0.9rem;
        line-height: 1.55;
        position: relative;
        word-wrap: break-word;
      }
      .nova-ai-message.assistant {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f0f4f8;
        border-bottom-left-radius: 4px;
      }
      .nova-ai-message.user {
        align-self: flex-end;
        background: #0599a8;
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }
      .nova-ai-timestamp {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 6px;
        text-align: right;
      }
      .nova-ai-action-btns {
        display: flex;
        gap: 6px;
        margin-top: 8px;
        flex-wrap: wrap;
      }
      .nova-ai-cta-btn {
        background: rgba(56, 189, 248, 0.15);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #38bdf8;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .nova-ai-cta-btn:hover {
        background: #0599a8;
        color: white;
      }

      /* Suggestion Chips */
      .nova-ai-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .nova-ai-chip {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #38bdf8;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .nova-ai-chip:hover {
        background: rgba(5, 153, 168, 0.3);
        border-color: #38bdf8;
      }

      /* Input Footer */
      .nova-ai-footer {
        padding: 12px 16px;
        background: rgba(1, 23, 49, 0.8);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 8px;
      }
      .nova-ai-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 10px 14px;
        color: white;
        font-size: 0.9rem;
        font-family: inherit;
      }
      .nova-ai-input:focus {
        outline: none;
        border-color: #0599a8;
      }
      .nova-ai-send-btn {
        background: #0599a8;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0 16px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
      }
      .nova-ai-send-btn:hover {
        background: #028491;
      }

      /* Typing Indicator */
      .nova-ai-typing {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 8px 12px;
      }
      .nova-ai-typing span {
        width: 6px;
        height: 6px;
        background: #38bdf8;
        border-radius: 50%;
        animation: typingBlink 1.4s infinite ease-in-out both;
      }
      .nova-ai-typing span:nth-child(1) { animation-delay: -0.32s; }
      .nova-ai-typing span:nth-child(2) { animation-delay: -0.16s; }

      @keyframes floatPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      @keyframes typingBlink {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .nova-ai-float-btn {
          bottom: 80px;
          right: 20px;
          padding: 10px 16px;
          font-size: 0.875rem;
        }
        .nova-ai-panel {
          bottom: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectWidgetHTML() {
    if (document.getElementById('nova-ai-float-btn')) return;

    // Floating Button
    const btn = document.createElement('button');
    btn.id = 'nova-ai-float-btn';
    btn.className = 'nova-ai-float-btn';
    btn.setAttribute('aria-label', 'Open Nova AI Career Advisor');
    btn.innerHTML = `<span class="nova-ai-pulse-dot"></span>🤖 Ask Nova AI`;
    btn.onclick = togglePanel;
    document.body.appendChild(btn);

    // Floating Panel
    const panel = document.createElement('div');
    panel.id = 'nova-ai-panel';
    panel.className = 'nova-ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'nova-ai-title');

    const user = getUserProfile();
    const userName = user ? user.name || 'Student' : '';
    const welcomeGreeting = userName ? `👋 Hi ${userName}! I'm Nova AI Career Advisor.` : `👋 Hi! I'm Nova AI Career Advisor.`;

    panel.innerHTML = `
      <div class="nova-ai-header">
        <div class="nova-ai-header-left">
          <div class="nova-ai-avatar">
            🤖
            <span class="nova-ai-status-online"></span>
          </div>
          <div>
            <div class="nova-ai-header-title" id="nova-ai-title">Nova AI Career Advisor</div>
            <div class="nova-ai-header-sub">Ask anything about courses, careers, admissions or placements.</div>
          </div>
        </div>
        <div class="nova-ai-header-controls">
          <button class="nova-ai-icon-btn" onclick="NovaAIWidget.togglePanel()" title="Minimize">─</button>
          <button class="nova-ai-icon-btn" onclick="NovaAIWidget.togglePanel()" title="Close">✕</button>
        </div>
      </div>

      <div class="nova-ai-body" id="nova-ai-body">
        <div class="nova-ai-message assistant">
          ${welcomeGreeting}<br/><br/>
          I can help you with:<br/>
          • Choosing the right course<br/>
          • Course fees<br/>
          • Duration<br/>
          • Placement support<br/>
          • Certifications<br/>
          • Career guidance<br/>
          • Admission process<br/>
          • Batch timings<br/><br/>
          How can I help you today?

          <div class="nova-ai-chips">
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Which course is best for me?')">Which course is best for me?</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Digital Marketing Course')">Digital Marketing Course</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Graphic Design Course')">Graphic Design Course</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Website Development Course')">Website Development Course</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Video Editing Course')">Video Editing Course</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Course Fees')">Course Fees</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Placement Support')">Placement Support</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Admission Process')">Admission Process</span>
            <span class="nova-ai-chip" onclick="NovaAIWidget.sendChip('Batch Timings')">Batch Timings</span>
          </div>
        </div>
      </div>

      <div class="nova-ai-footer">
        <input type="text" class="nova-ai-input" id="nova-ai-input" placeholder="Ask about fees, duration, placement..." onkeypress="NovaAIWidget.handleKeyPress(event)">
        <button class="nova-ai-send-btn" onclick="NovaAIWidget.sendMessage()">Send</button>
      </div>
    `;
    document.body.appendChild(panel);

    loadHistory();
  }

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    const panel = document.getElementById('nova-ai-panel');
    if (panel) {
      panel.classList.toggle('open', isPanelOpen);
      if (isPanelOpen) {
        trackEvent('ai_widget_opened');
        document.getElementById('nova-ai-input')?.focus();
      } else {
        trackEvent('ai_widget_closed');
      }
    }
  }

  function sendChip(text) {
    trackEvent('suggestion_chip_clicked', { text });
    document.getElementById('nova-ai-input').value = text;
    sendMessage();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  async function sendMessage() {
    if (isGenerating) return;
    const inputEl = document.getElementById('nova-ai-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    inputEl.value = '';
    appendMessage(userText, 'user');
    saveHistory();
    trackEvent('first_user_message', { query: userText });

    showTypingIndicator();
    isGenerating = true;

    try {
      const res = await fetch(WORKER_AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      removeTypingIndicator();
      isGenerating = false;

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.response) {
          appendMessage(data.response, 'assistant');
        } else {
          fallbackResponse(userText);
        }
      } else {
        fallbackResponse(userText);
      }
    } catch (err) {
      removeTypingIndicator();
      isGenerating = false;
      fallbackResponse(userText);
    }

    saveHistory();
  }

  function fallbackResponse(queryText) {
    const lower = queryText.toLowerCase();
    let reply = "I'm not completely sure about that. Let me connect you with our counselling team for accurate information.";
    let matched = false;

    for (const [key, text] of Object.entries(KNOWLEDGE_RESPONSES)) {
      if (lower.includes(key)) {
        reply = text;
        matched = true;
        break;
      }
    }

    appendMessage(reply, 'assistant', true);
  }

  function appendMessage(text, role, showCTAs = false) {
    const bodyEl = document.getElementById('nova-ai-body');
    if (!bodyEl) return;

    const msgEl = document.createElement('div');
    msgEl.className = `nova-ai-message ${role}`;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let html = text.replace(/\n/g, '<br/>');
    msgEl.innerHTML = html;

    if (role === 'assistant') {
      if (showCTAs || text.includes('counselling') || text.includes('fees') || text.includes('admission')) {
        const ctaWrap = document.createElement('div');
        ctaWrap.className = 'nova-ai-action-btns';
        ctaWrap.innerHTML = `
          <button class="nova-ai-cta-btn" onclick="NovaAIWidget.triggerCTA('counselling')">Book Free Counselling</button>
          <button class="nova-ai-cta-btn" onclick="NovaAIWidget.triggerCTA('apply')">Apply Now</button>
        `;
        msgEl.appendChild(ctaWrap);
      }

      const copyBtn = document.createElement('button');
      copyBtn.style.cssText = 'background:none;border:none;color:#94a3b8;font-size:0.75rem;cursor:pointer;margin-top:6px;display:block;';
      copyBtn.innerText = '📋 Copy';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.innerText = '✅ Copied!';
        setTimeout(() => copyBtn.innerText = '📋 Copy', 2000);
      };
      msgEl.appendChild(copyBtn);
    }

    const timeEl = document.createElement('div');
    timeEl.className = 'nova-ai-timestamp';
    timeEl.innerText = timestamp;
    msgEl.appendChild(timeEl);

    bodyEl.appendChild(msgEl);
    bodyEl.scrollTop = bodyEl.scrollHeight;

    chatHistory.push({ role, text, timestamp });
  }

  function showTypingIndicator() {
    const bodyEl = document.getElementById('nova-ai-body');
    const typingEl = document.createElement('div');
    typingEl.id = 'nova-ai-typing-indicator';
    typingEl.className = 'nova-ai-message assistant';
    typingEl.innerHTML = `
      <div class="nova-ai-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    bodyEl.appendChild(typingEl);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById('nova-ai-typing-indicator')?.remove();
  }

  function triggerCTA(action) {
    trackEvent('cta_clicked', { action });
    if (typeof window.openConsultationPopup === 'function') {
      window.openConsultationPopup();
    } else {
      window.location.href = 'index.html#counselling';
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(chatHistory.slice(-20)));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(item => {
            appendMessage(item.text, item.role);
          });
        }
      }
    } catch (e) {}
  }

  function init() {
    injectWidgetStyles();
    injectWidgetHTML();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        togglePanel();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NovaAIWidget = {
    togglePanel,
    sendMessage,
    sendChip,
    handleKeyPress,
    triggerCTA
  };

})();
