import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertTriangle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const SignInView: React.FC = () => {
  const { signIn, inactivityTimedOut } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#052427] relative overflow-hidden">
      {/* Background ambient teal glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#006B70]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-[#14BEB8]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B4A50] to-[#07383D] border border-[#14BEB8]/30 shadow-xl mb-4">
            <ShieldCheck className="w-8 h-8 text-[#14BEB8]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            OFIS <span className="text-[#FFA987] font-medium text-lg">Control</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#8EACB0] mt-1 font-semibold">
            Administrative Operations Network
          </p>
        </div>

        {/* Security Warning Notice */}
        {inactivityTimedOut && (
          <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Session Expired (30m Inactivity)</p>
              <p className="mt-0.5 text-amber-200/80">For platform security, your session was automatically locked after 30 minutes of inactivity. Please re-authenticate.</p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-[#07383D]/90 backdrop-blur-xl border border-[#166D74] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 pb-4 border-b border-[#166D74]/60">
            <h2 className="text-lg font-semibold text-white">Administrator Sign In</h2>
            <p className="text-xs text-[#8EACB0] mt-1">
              Restricted portal. Unauthorized access attempts are monitored and recorded in the audit log.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#C2D7D9] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8EACB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ofis.ng"
                  className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5D7A7D] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C2D7D9] mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8EACB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5D7A7D] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#006B70] to-[#14BEB8] hover:from-[#005B60] hover:to-[#10ABA5] text-[#052427] font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-[#14BEB8]/15 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#052427]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#052427]" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#166D74]/40 text-center">
            <span className="text-[11px] text-[#5D7A7D] flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-[#14BEB8]" />
              Multi-Factor Authentication & IP Rate Limiting Enforced
            </span>
          </div>
        </div>

        <div className="text-center mt-6 text-[11px] text-[#5D7A7D]">
          OFIS Nigeria Physical Space Operations &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};
