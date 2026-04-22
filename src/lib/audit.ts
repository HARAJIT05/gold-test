import { supabase } from './supabase';

export async function logAdminAction(adminEmail: string, action: string, details: string) {
  try {
    await supabase.from('audit_logs').insert([{
      admin_email: adminEmail,
      action,
      details,
      created_at: Date.now()
    }]);
  } catch (err) {
    console.error("Failed to write to audit log", err);
  }
}
