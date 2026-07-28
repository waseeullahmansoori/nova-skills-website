/**
 * Admin Activity & Audit Log Controller
 */

let auditLogsList = [
  { created_at: new Date().toISOString(), user_role: 'Admin', user_id: 'usr-admin-01', action: 'Login', entity_type: 'Auth', description: 'Admin user logged in successfully' },
  { created_at: new Date(Date.now() - 3600000).toISOString(), user_role: 'Admin', user_id: 'usr-admin-01', action: 'Student Created', entity_type: 'Student', description: 'Created student profile for STU-1001 (Rohan Verma)' },
  { created_at: new Date(Date.now() - 7200000).toISOString(), user_role: 'Admin', user_id: 'usr-admin-01', action: 'Settings Updated', entity_type: 'Settings', description: 'Updated platform support contact & tagline settings' }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchAuditLogs();
});

async function fetchAuditLogs() {
  try {
    const res = await fetch('/api/admin/activity');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.logs) {
        auditLogsList = data.logs;
      }
    }
  } catch (e) {
    console.warn('Using local audit buffer.');
  }

  renderLogs(auditLogsList);
}

function renderLogs(list) {
  const tbody = document.getElementById('activityTableBody');
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td style="color:#94a3b8;font-size:0.875rem;">${new Date(item.created_at).toLocaleString()}</td>
      <td><strong>${item.user_role || 'Admin'}</strong> <span style="font-size:0.75rem;color:#64748b;">(${item.user_id || 'system'})</span></td>
      <td><span class="action-badge">${item.action}</span></td>
      <td>${item.entity_type || 'General'}</td>
      <td style="color:#cbd5e1;">${item.description}</td>
    </tr>
  `).join('');
}

function applyAuditFilters() {
  const uFilter = document.getElementById('filterUser').value.toLowerCase();
  const mFilter = document.getElementById('filterModule').value.toLowerCase();
  const aFilter = document.getElementById('filterAction').value.toLowerCase();

  const filtered = auditLogsList.filter(item => {
    const userMatch = (item.user_role + ' ' + item.user_id).toLowerCase().includes(uFilter);
    const moduleMatch = (item.entity_type || '').toLowerCase().includes(mFilter);
    const actionMatch = (item.action || '').toLowerCase().includes(aFilter);
    return userMatch && moduleMatch && actionMatch;
  });

  renderLogs(filtered);
}
