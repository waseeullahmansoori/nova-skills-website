/**
 * Student Dashboard & Experience Platform Aggregator Service
 */

export function getStudentDashboardData(studentId = 'STU-1001') {
  return {
    studentProfile: {
      studentId: studentId,
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      mobile: "9876543210",
      city: "Lucknow",
      enrolledDate: "2026-06-15",
      avatar: "https://novaskills.in/assets/logo.png"
    },
    enrolledCourses: [
      {
        courseId: "CRS-DM",
        name: "Digital Marketing Master Program",
        progressPercentage: 68,
        trainer: "Vikram Mehta",
        batchTiming: "Morning Batch (9:00 AM – 11:00 AM)",
        nextClass: "Tomorrow 9:00 AM IST",
        modulesCompleted: 8,
        totalModules: 12
      }
    ],
    attendance: {
      totalClasses: 36,
      present: 32,
      absent: 3,
      leave: 1,
      attendancePercentage: "88.8%"
    },
    assignments: [
      {
        id: "ASN-01",
        title: "SEO Keyword Research & Audit Report",
        dueDate: "2026-07-30",
        status: "Pending Submission",
        marks: null
      },
      {
        id: "ASN-02",
        title: "Meta Ads Campaign Setup",
        dueDate: "2026-07-20",
        status: "Evaluated",
        marks: "95 / 100",
        feedback: "Excellent audience targeting and copy structure!"
      }
    ],
    projects: [
      {
        id: "PRJ-01",
        title: "E-Commerce Live Client Growth Campaign",
        status: "In Review",
        submissionLink: "https://github.com/rohan/live-project"
      }
    ],
    payments: {
      totalFee: 25000,
      paidAmount: 15000,
      pendingAmount: 10000,
      nextDueDate: "2026-08-05",
      receipts: [
        { receiptNo: "REC-501", amount: 15000, date: "2026-06-15", mode: "UPI" }
      ]
    },
    certificates: [
      {
        id: "CERT-NS-9042",
        title: "Digital Marketing Foundation Certificate",
        issueDate: "2026-07-01",
        verifyUrl: "https://novaskills.in/verify/CERT-NS-9042",
        downloadUrl: "https://novaskills.in/certificates/CERT-NS-9042.pdf"
      }
    ],
    announcements: [
      { id: 1, date: "2026-07-26", title: "Live Guest Workshop on AI Marketing Tools this Saturday at 11 AM!" }
    ]
  };
}
