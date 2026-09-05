import { getSupabaseClient, supabase, isSupabaseConfigured } from './supabaseClient';

export interface PrelaunchLeadInput {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
  source?: string;
  company?: string;
  country?: string;
  format?: 'json' | 'string';
}

export interface SubmitLeadResult {
  success: boolean;
  error?: string;
  hint?: string;
  data?: any;
}

/**
 * Submits a prelaunch signup directly to the Supabase "leads" table using the anon role.
 * Maps:
 *   - name -> name
 *   - email -> email
 *   - interest -> interest
 *   - message -> message (including phone if provided)
 *   - source -> 'prelaunch'
 *   - landing_path -> current window path
 */
export async function submitPrelaunchLead(
  input: PrelaunchLeadInput
): Promise<SubmitLeadResult> {
  const client = getSupabaseClient() || supabase;
  if (!client) {
    return {
      success: false,
      error: 'Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  const cleanName = (input.name || '').trim();
  const cleanEmail = (input.email || '').trim().toLowerCase();
  const cleanInterest = (input.interest || '').trim() || 'Pre-launch Early Access';
  const cleanPhone = (input.phone || '').trim();
  const cleanMsg = (input.message || '').trim() || 'Early access interest';

  // Format message, appending phone if provided
  const formattedMessage = cleanPhone
    ? `${cleanMsg} | Phone: ${cleanPhone}`
    : cleanMsg;

  // Exact payload targeting existing columns in public.leads:
  // id, name, email, company, country, interest, message, source, referrer, landing_path, utm_source, utm_medium, utm_campaign, created_at
  const payload = {
    name: cleanName,
    email: cleanEmail,
    interest: cleanInterest,
    message: formattedMessage,
    source: input.source || 'prelaunch',
    landing_path: typeof window !== 'undefined' ? window.location.pathname : '/',
  };

  try {
    const { data, error } = await client.from('leads').insert([payload]);

    if (error) {
      console.error('[leadService] Supabase leads insert error:', error);
      
      let hint: string | undefined = (error as any).hint;
      if (error.code === '42501') {
        hint = 'Permission denied for table leads. In Supabase SQL editor, run: GRANT INSERT ON public.leads TO anon;';
      }

      return {
        success: false,
        error: error.message || 'Failed to submit lead to Supabase',
        hint,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error('[leadService] Unexpected error:', err);
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during submission.',
    };
  }
}
