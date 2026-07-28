/**
 * Admin Dashboard Controller Module
 */

const sampleStudents = [
  { code: 'STU-1001', name: 'Rohan Verma', email: 'rohan.verma@example.com', mobile: '9876543210', status: 'Active' },
  { code: 'STU-1002', name: 'Priya Sharma', email: 'priya.sharma@example.com', mobile: '9876543211', status: 'Active' },
  { code: 'STU-1003', name: 'Amit Kumar', email: 'amit.kumar@example.com', mobile: '9876543212', status: 'Inactive' }
];

const sampleCourses = [
  { name: 'Digital Marketing Master Program', duration: '3 Months', fee: '₹25,000', status: 'Active' },
  { name: 'Full Stack Web Development', duration: '6 Months', fee: '₹45,000', status: 'Active' },
  { name: 'Python & AI Engineering', duration: '4 Months', fee: '₹35,000', status: 'Active' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderStudentTable();
});

function switchSection(section) {
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');

  const titleEl = document.getElementById('section-title');
  const contentEl = document.getElementById('section-content');

  if (section === 'dashboard' || section === 'students') {
    titleEl.innerText = 'Student Management';
    renderStudentTable();
  } else if (section === 'courses') {
    titleEl.innerText = 'Course Catalog Management';
    renderCourseTable();
  } else if (section === 'enrollments') {
    titleEl.innerText = 'Enrollment & Batch Allocation';
    contentEl.innerHTML = `<p style="color:#94a3b8;">Manage batch allocations and student enrollments.</p>`;
  } else if (section === 'settings') {
    titleEl.innerText = 'Admin Settings';
    contentEl.innerHTML = `<p style="color:#94a3b8;">Institute configuration and secret management.</p>`;
  }
}

function renderStudentTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  tbody.innerHTML = sampleStudents.map(s => `
    <tr>
      <td><strong>${s.code}</strong></td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.mobile}</td>
      <td><span style="color:${s.status === 'Active' ? '#4ade80' : '#f87171'}">${s.status}</span></td>
      <td>
        <button class="btn-admin" style="padding:0.25rem 0.5rem;font-size:0.75rem;" onclick="editStudent('${s.code}')">Edit</button>
      </td>
    </tr>
  `).join('');
}

function renderCourseTable() {
  const contentEl = document.getElementById('section-content');
  contentEl.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Duration</th>
          <th>Fee</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${sampleCourses.map(c => `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.duration}</td>
            <td>${c.fee}</td>
            <td><span style="color:#4ade80">${c.status}</span></td>
            <td><button class="btn-admin" style="padding:0.25rem 0.5rem;font-size:0.75rem;">Edit</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function filterTable() {
  const query = document.getElementById('searchBox').value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function openAddModal() {
  alert('Modal: Add student or course form ready for administration.');
}

function editStudent(code) {
  alert(`Editing student code: ${code}`);
}

function logoutAdmin() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = '/';
  }
}
