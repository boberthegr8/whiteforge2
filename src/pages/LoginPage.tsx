import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { useToast } from '../lib/toast';
import { Truck, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const { login } = useAppStore();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      addToast('Welcome back!', 'success');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      {/* Background gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f97316] rounded-full blur-[180px] opacity-[0.04]" />
      </div>

      <div className="w-full max-w-[400px] animate-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-[14px] bg-[#f97316] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(249,115,22,0.35)]">
            <Truck className="text-white w-9 h-9" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Forge AM</h1>
          <p className="text-[#9ca3af] text-sm mt-1 tracking-widest uppercase">V2.1414</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Sign in to your account</h2>
          <p className="text-[#9ca3af] text-sm mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="email"
                  className="win-input w-full pl-10"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="win-input w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="bg-[#3b1a1a] border border-[#ef4444]/30 rounded-[6px] p-3 text-sm text-[#ef4444] flex items-center gap-2">
                <span className="text-base">⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="win-btn win-btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3 text-base"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#6b7280] text-xs mt-6">
          Forge AM V2.1414 · JK Hardware Group
        </p>
      </div>
    </div>
  );
}
