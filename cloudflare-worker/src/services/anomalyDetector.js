/**
 * Business Anomaly & Risk Detector Service
 */

export function detectBusinessAnomalies(crmData = {}) {
  const anomalies = [];

  const totalLeads = crmData.totalLeads || 0;
  const duplicateLeads = crmData.duplicateLeads || 0;
  const pendingFollowUps = crmData.pendingFollowUps || 0;
  const admissions = crmData.admissions || 0;

  // 1. High Duplicate Spike Check (>20% duplicates)
  if (totalLeads > 10 && (duplicateLeads / totalLeads) > 0.20) {
    anomalies.push(`HIGH DUPLICATE SPIKE: ${((duplicateLeads / totalLeads) * 100).toFixed(1)}% of total leads are duplicate submissions.`);
  }

  // 2. Overdue Follow-up Bottleneck (>30% leads pending)
  if (totalLeads > 10 && (pendingFollowUps / totalLeads) > 0.30) {
    anomalies.push(`FOLLOW-UP BOTTLENECK: ${pendingFollowUps} leads are currently overdue/pending follow-up.`);
  }

  // 3. Low Pipeline Conversion Risk (<5% conversion)
  if (totalLeads >= 20 && (admissions / totalLeads) < 0.05) {
    anomalies.push(`LOW CONVERSION ALERT: Current conversion rate is below 5.0%. Immediate counsellor follow-up required.`);
  }

  if (anomalies.length === 0) {
    anomalies.push("Pipeline metrics operating within normal baseline limits.");
  }

  return anomalies;
}
