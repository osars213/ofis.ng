import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  inactivityTimedOut: boolean;
  remainingMinutes: number;
  isMfaRequired: boolean;
  isMfaEnrollmentRequired: boolean;
  mfaFactors: any[];
  signIn: (email: string, pass: string) => Promise<{ success: boolean; requiresMfa?: boolean; requiresEnrollment?: boolean; error?: string }>;
  verifyMfaTotp: (factorId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  enrollMfaTotp: () => Promise<{ success: boolean; factorId?: string; totp?: any; error?: string }>;
  signOut: (reason?: 'manual' | 'inactivity') => void;
  resetInactivityTimer: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('ofis_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ofis_admin_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inactivityTimedOut, setInactivityTimedOut] = useState<boolean>(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number>(30);
  const [isMfaRequired, setIsMfaRequired] = useState<boolean>(false);
  const [isMfaEnrollmentRequired, setIsMfaEnrollmentRequired] = useState<boolean>(false);
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);

  const lastActivityRef = useRef<number>(Date.now());
  const pendingSessionRef = useRef<any>(null);

  // Initialize Supabase Client for client-side MFA challenges
  const supabaseClientRef = useRef<SupabaseClient | null>(null);
  if (!supabaseClientRef.current) {
    const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
    const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
    if (rawUrl && anonKey) {
      supabaseClientRef.current = createClient(rawUrl, anonKey);
    }
  }

  // Reset inactivity timestamp
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingMinutes(30);
  }, []);

  // Sign out function
  const signOut = useCallback((reason: 'manual' | 'inactivity' = 'manual') => {
    setAdminUser(null);
    setToken(null);
    setIsMfaRequired(false);
    setMfaFactors([]);
    pendingSessionRef.current = null;
    localStorage.removeItem('ofis_admin_token');
    localStorage.removeItem('ofis_admin_user');

    if (reason === 'inactivity') {
      setInactivityTimedOut(true);
    } else {
      setInactivityTimedOut(false);
    }
  }, []);

  // Monitor user activity events (mouse, keyboard, touch, scroll)
  useEffect(() => {
    if (!token) return;

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Inactivity check interval every 15 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const timeLeft = Math.max(0, INACTIVITY_TIMEOUT_MS - elapsed);
      const minutesLeft = Math.ceil(timeLeft / 60000);
      setRemainingMinutes(minutesLeft);

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        console.warn('[Admin Security] 30 minutes of inactivity reached. Signing out admin session.');
        signOut('inactivity');
      }
    }, 15000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(interval);
    };
  }, [token, signOut]);

  // Initial session validation on mount
  useEffect(() => {
    const validateExistingSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === 'admin') {
            setAdminUser(data.user);
            resetInactivityTimer();
          } else {
            signOut('manual');
          }
        } else if (res.status === 403) {
          const errData = await res.json().catch(() => ({}));
          if (errData.error === 'MFA_ENROLLMENT_REQUIRED' || errData.requiresEnrollment) {
            setIsMfaRequired(true);
            setIsMfaEnrollmentRequired(true);
          } else if (errData.error === 'MFA_REQUIRED') {
            setIsMfaRequired(true);
            setIsMfaEnrollmentRequired(false);
          } else {
            signOut('manual');
          }
        } else {
          // Token expired or invalid
          signOut('manual');
        }
      } catch (err) {
        console.warn('Could not validate admin session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    validateExistingSession();
  }, [token, signOut, resetInactivityTimer]);

  // Listen for 403 MFA required events from AdminApiClient
  useEffect(() => {
    const handleMfaEvent = (e: any) => {
      const detail = e.detail || {};
      setIsMfaRequired(true);
      if (detail.requiresEnrollment) {
        setIsMfaEnrollmentRequired(true);
      } else {
        setIsMfaEnrollmentRequired(false);
      }
    };

    window.addEventListener('ofis_admin_mfa_required', handleMfaEvent);
    return () => window.removeEventListener('ofis_admin_mfa_required', handleMfaEvent);
  }, []);

  // Sign In Method
  const signIn = async (email: string, pass: string): Promise<{ success: boolean; requiresMfa?: boolean; requiresEnrollment?: boolean; error?: string }> => {
    setInactivityTimedOut(false);
    try {
      const res = await fetch('/api/admin/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      if (data.requiresMfaEnrollment) {
        pendingSessionRef.current = data;
        setIsMfaRequired(true);
        setIsMfaEnrollmentRequired(true);
        setMfaFactors([]);
        return { success: true, requiresMfa: true, requiresEnrollment: true };
      }

      if (data.requiresMfaVerification && data.mfaFactors && data.mfaFactors.length > 0) {
        // Multi-Factor Authentication is enrolled and required
        pendingSessionRef.current = data;
        setIsMfaRequired(true);
        setIsMfaEnrollmentRequired(false);
        setMfaFactors(data.mfaFactors);
        return { success: true, requiresMfa: true, requiresEnrollment: false };
      }

      // MFA verified or single factor completed
      const sessionToken = data.session.access_token;
      setToken(sessionToken);
      setAdminUser(data.user);
      localStorage.setItem('ofis_admin_token', sessionToken);
      localStorage.setItem('ofis_admin_user', JSON.stringify(data.user));
      resetInactivityTimer();

      return { success: true, requiresMfa: false };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during sign-in' };
    }
  };

  // Enroll in MFA TOTP
  const enrollMfaTotp = async (): Promise<{ success: boolean; factorId?: string; totp?: any; error?: string }> => {
    try {
      const pendingData = pendingSessionRef.current;
      const effectiveToken = token || pendingData?.session?.access_token;
      if (!effectiveToken) return { success: false, error: 'No active session found for MFA enrollment' };

      const res = await fetch('/api/admin/auth/mfa/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to initialize MFA enrollment' };
      }

      return { success: true, factorId: data.factorId, totp: data.totp };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during MFA enrollment' };
    }
  };

  // Verify MFA TOTP code
  const verifyMfaTotp = async (factorId: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const pendingData = pendingSessionRef.current;
      if (!pendingData || !pendingData.session) {
        return { success: false, error: 'No pending admin session found. Please sign in again.' };
      }

      // 1. Try server-side rate-limited MFA verification route first
      try {
        const srvRes = await fetch('/api/admin/auth/mfa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            factorId,
            code: code.trim(),
            accessToken: pendingData.session.access_token,
            refreshToken: pendingData.session.refresh_token,
          }),
        });

        if (srvRes.ok) {
          const srvData = await srvRes.json();
          if (srvData.accessToken) {
            const verifiedToken = srvData.accessToken;
            setToken(verifiedToken);
            setAdminUser(pendingData.user);
            localStorage.setItem('ofis_admin_token', verifiedToken);
            localStorage.setItem('ofis_admin_user', JSON.stringify(pendingData.user));
            setIsMfaRequired(false);
            setMfaFactors([]);
            pendingSessionRef.current = null;
            resetInactivityTimer();
            return { success: true };
          }
        } else {
          const errData = await srvRes.json().catch(() => ({}));
          if (errData.error) {
            return { success: false, error: errData.error };
          }
        }
      } catch (srvErr) {
        console.warn('[Admin Auth] Server-side MFA verify failed, trying client verification:', srvErr);
      }

      // 2. Direct client fallback if configured
      const supabase = supabaseClientRef.current;
      if (supabase) {
        await supabase.auth.setSession({
          access_token: pendingData.session.access_token,
          refresh_token: pendingData.session.refresh_token,
        });

        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
          return { success: false, error: challenge.error.message };
        }

        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.data.id,
          code: code.trim(),
        });

        if (verify.error) {
          return { success: false, error: verify.error.message };
        }

        const verifiedToken = verify.data.access_token || pendingData.session.access_token;
        setToken(verifiedToken);
        setAdminUser(pendingData.user);
        localStorage.setItem('ofis_admin_token', verifiedToken);
        localStorage.setItem('ofis_admin_user', JSON.stringify(pendingData.user));
        setIsMfaRequired(false);
        setMfaFactors([]);
        pendingSessionRef.current = null;
        resetInactivityTimer();
        return { success: true };
      }

      return { success: false, error: 'MFA verification could not be completed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to verify MFA TOTP code' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        inactivityTimedOut,
        remainingMinutes,
        isMfaRequired,
        isMfaEnrollmentRequired,
        mfaFactors,
        signIn,
        verifyMfaTotp,
        enrollMfaTotp,
        signOut,
        resetInactivityTimer,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
