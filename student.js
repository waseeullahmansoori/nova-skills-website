/**
 * Student Portal Controller Module
 */

let currentStudent = {
  code: 'STU-1001',
  name: 'Rohan Verma',
  email: 'rohan.verma@example.com',
  mobile: '9876543210',
  city: 'Lucknow',
  admissionDate: '2026-06-15',
  status: 'Active',
  avatarUrl: 'https://novaskills.in/assets/logo.png',
  courses: [
    {
      name: 'Digital Marketing Master Program',
      duration: '3 Months',
      batch: 'Morning Batch (9:00 AM – 11:00 AM)',
      status: 'Enrolled',
      description: 'Comprehensive practical training covering SEO, Meta Ads, Google Ads, Content Strategy, and Analytics.'
    }
  ],
  files: [
    { name: 'Digital Marketing Course Syllabus.pdf', type: 'Study Material', url: '#' },
    { name: 'SEO & Keyword Research Checklist.pdf', type: 'Study Material', url: '#' },
    { name: 'Foundation Completion Certificate.pdf', type: 'Certificate', url: '#' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  renderStudentDashboard();
});

function switchStudentSection(section) {
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');

  if (section === 'dashboard') {
    renderStudentDashboard();
  } else if (section === 'profile') {
    renderStudentProfile();
  } else if (section === 'courses') {
    renderStudentCourses();
  } else if (section === 'files') {
    renderStudentFiles();
  }
}

function renderStudentDashboard() {
  const contentEl = document.getElementById('student-section-content');
  contentEl.innerHTML = `
    <div class="profile-card">
      <h3 style="margin-top:0;">Account Status Summary</h3>
      <p><strong>Student Code:</strong> ${currentStudent.code}</p>
      <p><strong>Admission Date:</strong> ${currentStudent.admissionDate}</p>
      <p><strong>Status:</strong> <span style="color:#4ade80;font-weight:600;">${currentStudent.status}</span></p>
      <p><strong>Enrolled Programs:</strong> ${currentStudent.courses.map(c => c.name).join(', ')}</p>
    </div>
  `;
}

function renderStudentProfile() {
  const contentEl = document.getElementById('student-section-content');
  contentEl.innerHTML = `
    <div class="profile-card">
      <h3 style="margin-top:0;">My Profile Settings</h3>
      <form onsubmit="updateProfile(event)">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" class="form-control" value="${currentStudent.name}" readonly>
        </div>
        <div class="form-group">
          <label>Email Address (Read-only)</label>
          <input type="email" class="form-control" value="${currentStudent.email}" readonly>
        </div>
        <div class="form-group">
          <label>Mobile Number</label>
          <input type="text" id="editMobile" class="form-control" value="${currentStudent.mobile}">
        </div>
        <div class="form-group">
          <label>City</label>
          <input type="text" id="editCity" class="form-control" value="${currentStudent.city}">
        </div>
        <div class="form-group">
          <label>Profile Photo URL</label>
          <input type="text" id="editAvatar" class="form-control" value="${currentStudent.avatarUrl}">
        </div>
        <button type="submit" class="btn-student">Save Changes</button>
      </form>
    </div>
  `;
}

function renderStudentCourses() {
  const contentEl = document.getElementById('student-section-content');
  contentEl.innerHTML = currentStudent.courses.map(c => `
    <div class="profile-card">
      <h3 style="margin-top:0;color:#38bdf8;">${c.name}</h3>
      <p><strong>Duration:</strong> ${c.duration}</p>
      <p><strong>Batch:</strong> ${c.batch}</p>
      <p><strong>Enrollment Status:</strong> <span style="color:#4ade80">${c.status}</span></p>
      <p style="color:#94a3b8;line-height:1.5;">${c.description}</p>
    </div>
  `).join('');
}

function renderStudentFiles() {
  const contentEl = document.getElementById('student-section-content');
  contentEl.innerHTML = `
    <div class="profile-card">
      <h3 style="margin-top:0;">My Files & Learning Resources</h3>
      ${currentStudent.files.map(f => `
        <div class="file-item">
          <div>
            <strong>${f.name}</strong>
            <div style="font-size:0.75rem;color:#94a3b8;">${f.type}</div>
          </div>
          <button class="btn-student" style="padding:0.4rem 0.8rem;font-size:0.875rem;" onclick="alert('Downloading ${f.name}...')">Download</button>
        </div>
      `).join('')}
    </div>
  `;
}

function updateProfile(e) {
  e.preventDefault();
  currentStudent.mobile = document.getElementById('editMobile').value;
  currentStudent.city = document.getElementById('editCity').value;
  currentStudent.avatarUrl = document.getElementById('editAvatar').value;
  alert('Profile updated successfully!');
}

function logoutStudent() {
  if (confirm('Are you sure you want to log out?')) {
    window.location.href = '/';
  }
}
