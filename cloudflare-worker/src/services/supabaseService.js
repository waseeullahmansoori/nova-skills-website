/**
 * Supabase Data Access Repository Service
 */

import { SupabaseWorkerClient } from '../supabase/client.js';

export async function fetchStudentsFromSupabase(env, config) {
  const client = new SupabaseWorkerClient(env, config);
  const builder = await client.from('students');
  return await builder.select('*');
}

export async function createStudentInSupabase(studentData, env, config) {
  const client = new SupabaseWorkerClient(env, config);
  const builder = await client.from('students');

  const record = {
    student_code: studentData.studentCode || `STU-${Date.now().toString().slice(-4)}`,
    full_name: studentData.name || studentData.fullName,
    mobile: studentData.mobile,
    email: studentData.email || '',
    city: studentData.city || '',
    status: 'Enrolled'
  };

  return await builder.insert(record);
}

export async function createAdmissionInSupabase(admissionData, env, config) {
  const client = new SupabaseWorkerClient(env, config);
  const builder = await client.from('admissions');

  const record = {
    student_id: admissionData.studentId,
    lead_id: admissionData.leadId || '',
    total_fee: admissionData.totalFee || 25000,
    final_fee: admissionData.finalFee || 25000,
    status: 'Confirmed'
  };

  return await builder.insert(record);
}
