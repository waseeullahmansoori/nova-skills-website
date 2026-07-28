/**
 * Settings Center Controller Module
 */

let activeTab = 'institute';
let settingsData = {
  institute: { name: 'Nova Skills Institute', tagline: 'Empowering Tech Leaders', address: 'Nova Skills Institute, Siddharth Nagar', city: 'Siddharth Nagar', state: 'Uttar Pradesh', country: 'India', website: 'https://novaskills.in', supportEmail: 'novaskills.official@gmail.com', supportPhone: '+91 9695904440', whatsappNumber: '+91 9695904440' },
  branding: { logoUrl: 'https://novaskills.in/assets/logo.png', faviconUrl: 'https://novaskills.in/favicon.ico', primaryColor: '#0599a8', secondaryColor: '#011731' },
  social: { facebook: 'https://facebook.com/novaskills', instagram: 'https://instagram.com/novaskills', linkedin: 'https://linkedin.com/company/novaskills', youtube: 'https://youtube.com/@novaskills', twitter: 'https://x.com/novaskills' },
  ai: { systemPrompt: 'You are Nova Skills AI Advisor.', welcomeMessage: 'Hello! I am your Nova Skills AI Advisor.', aiEnabled: true },
  contact: { admissionEmail: 'novaskills.official@gmail.com', admissionPhone: '+91 9695904440', officeTiming: 'Mon – Sat: 9 AM – 7 PM' },
  security: { sessionTimeoutMinutes: 1440, maintenanceMode: false }
};

document.addEventListener('DOMContentLoaded', () => {
  renderTabContent();
});

function switchTab(tab) {
  document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  activeTab = tab;
  renderTabContent();
}

function renderTabContent() {
  const container = document.getElementById('tabContent');

  if (activeTab === 'institute') {
    container.innerHTML = `
      <form onsubmit="saveSettings(event)">
        <h3>Institute Information</h3>
        <div class="form-group"><label>Institute Name</label><input type="text" class="form-control" value="${settingsData.institute.name}"></div>
        <div class="form-group"><label>Tagline</label><input type="text" class="form-control" value="${settingsData.institute.tagline}"></div>
        <div class="form-group"><label>Address</label><input type="text" class="form-control" value="${settingsData.institute.address}"></div>
        <div class="form-group"><label>City</label><input type="text" class="form-control" value="${settingsData.institute.city}"></div>
        <div class="form-group"><label>Support Email</label><input type="email" class="form-control" value="${settingsData.institute.supportEmail}"></div>
        <button type="submit" class="btn-settings">Save Institute Settings</button>
      </form>
    `;
  } else if (activeTab === 'branding') {
    container.innerHTML = `
      <form onsubmit="saveSettings(event)">
        <h3>Branding & Theme</h3>
        <div class="form-group"><label>Logo URL</label><input type="text" class="form-control" value="${settingsData.branding.logoUrl}"></div>
        <div class="form-group"><label>Primary Brand Color</label><input type="color" class="form-control" value="${settingsData.branding.primaryColor}"></div>
        <button type="submit" class="btn-settings">Save Branding</button>
      </form>
    `;
  } else if (activeTab === 'ai') {
    container.innerHTML = `
      <form onsubmit="saveSettings(event)">
        <h3>AI Advisor Configuration</h3>
        <div class="form-group"><label>System Prompt</label><textarea class="form-control" rows="3">${settingsData.ai.systemPrompt}</textarea></div>
        <div class="form-group"><label>Welcome Message</label><input type="text" class="form-control" value="${settingsData.ai.welcomeMessage}"></div>
        <button type="submit" class="btn-settings">Save AI Config</button>
      </form>
    `;
  } else if (activeTab === 'contact') {
    container.innerHTML = `
      <form onsubmit="saveSettings(event)">
        <h3>Contact Settings</h3>
        <div class="form-group"><label>Admission Email</label><input type="email" class="form-control" value="${settingsData.contact.admissionEmail}"></div>
        <div class="form-group"><label>Office Timing</label><input type="text" class="form-control" value="${settingsData.contact.officeTiming}"></div>
        <button type="submit" class="btn-settings">Save Contact Settings</button>
      </form>
    `;
  } else if (activeTab === 'security') {
    container.innerHTML = `
      <form onsubmit="saveSettings(event)">
        <h3>Security & Maintenance</h3>
        <div class="form-group"><label>Session Timeout (Minutes)</label><input type="number" class="form-control" value="${settingsData.security.sessionTimeoutMinutes}"></div>
        <button type="submit" class="btn-settings">Save Security Settings</button>
      </form>
    `;
  }
}

function saveSettings(e) {
  e.preventDefault();
  alert('Settings saved successfully!');
}
