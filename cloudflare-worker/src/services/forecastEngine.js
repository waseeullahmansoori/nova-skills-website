/**
 * Predictive Analytics & Forecast Engine
 */

export function calculateForecasts(crmData = {}) {
  const totalLeads = crmData.totalLeads || 0;
  const hotLeads = crmData.hotLeads || Math.round(totalLeads * 0.25);
  const warmLeads = crmData.warmLeads || Math.round(totalLeads * 0.40);
  const currentAdmissions = crmData.admissions || 0;

  // Expected admissions calculation (60% of Hot + 25% of Warm)
  const expectedNewAdmissions = Math.round((hotLeads * 0.60) + (warmLeads * 0.25));
  const totalForecastedAdmissions = currentAdmissions + expectedNewAdmissions;

  // Revenue estimation (Average course fee ~₹24,000)
  const avgCourseFee = 24000;
  const estimatedRevenue = totalForecastedAdmissions * avgCourseFee;

  return {
    expectedAdmissionsNext30Days: totalForecastedAdmissions,
    expectedNewAdmissions: expectedNewAdmissions,
    expectedRevenue: `₹${estimatedRevenue.toLocaleString('en-IN')}`,
    highRiskLeadsCount: crmData.pendingFollowUps || Math.round(totalLeads * 0.15),
    batchFillingRate: `${Math.min(100, Math.round((totalForecastedAdmissions / 50) * 100))}%`
  };
}
