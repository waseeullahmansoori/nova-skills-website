const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const files = fs.readdirSync(path.join(ROOT_DIR, '_rendered_courses')).filter(f => f.endsWith('.html') && f !== '404.html');

console.log('Inspecting mentors and testimonials in', files.length, 'rendered course files...');

const mentorCounts = {};
const testimonialCounts = {};
let coursesWithNoMentor = 0;
let coursesWithNoTestimonial = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT_DIR, '_rendered_courses', file), 'utf8');
  
  // Extract mentor names (<h3 class="mentor-name">...</h3> or <h4 class="mentor-name">...</h4>)
  const mentorMatches = [...html.matchAll(/<h[34][^>]*class=["']mentor-name["'][^>]*>([^<]+)<\/h[34]>/gi)];
  if (mentorMatches.length === 0) {
    coursesWithNoMentor++;
  } else {
    mentorMatches.forEach(m => {
      const name = m[1].trim();
      mentorCounts[name] = (mentorCounts[name] || 0) + 1;
    });
  }

  // Extract student testimonial names (<h4 class="testimonial-name">...</h4> or <div class="testimonial-author">...</div>)
  const testMatches = [...html.matchAll(/class=["']testimonial-name["'][^>]*>([^<]+)</gi)];
  if (testMatches.length === 0) {
    coursesWithNoTestimonial++;
  } else {
    testMatches.forEach(m => {
      const name = m[1].trim();
      testimonialCounts[name] = (testimonialCounts[name] || 0) + 1;
    });
  }
}

console.log('\nMentors discovered across courses:');
for (const [name, count] of Object.entries(mentorCounts)) {
  console.log(`  - ${name}: ${count} courses`);
}
console.log('Courses without mentor markup:', coursesWithNoMentor);

console.log('\nStudent Testimonials discovered across courses:');
for (const [name, count] of Object.entries(testimonialCounts)) {
  console.log(`  - ${name}: ${count} courses`);
}
console.log('Courses without testimonial markup:', coursesWithNoTestimonial);
