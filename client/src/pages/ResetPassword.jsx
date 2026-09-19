import { useState, useEffect }      from 'react';
import { Link, useNavigate,
         useSearchParams }          from 'react-router-dom';
import { motion }                   from 'framer-motion';
import { Lock, Eye, EyeOff,
         Zap, CheckCircle,
         AlertCircle }              from 'lucide-react';
import toast                        from 'react-hot-toast';
import api                          from '../api/axios';

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6)          score++;
  if (password.length >= 10)         score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500'      };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-500'    };
  return              { score, label: 'Strong', color: 'bg-[#06FFA5]'    };
};

export default function ResetPassword() {
  const navigate          = useNavigate();
  const [params]          = useSearchParams();
  const token             = params.get('token');

  const [tokenValid,    setTokenValid]    = useState(null);
  const [maskedEmail,   setMaskedEmail]   = useState('');
  const [password,      setPassword]      = useState('');
  const [confirm,       setConfirm]       = useState('');
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [success,       setSuccess]       = useState(false);

  const strength = getStrength(password);

  // verify token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    const verify = async () => {
      try {
        const { data } = await api.get(
          `/auth/verify-reset/${token}`
        );
        setTokenValid(data.valid);
        setMaskedEmail(data.email || '');
      } catch {
        setTokenValid(false);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter a new password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Reset failed. Try again.'
      );
    }
    setLoading(false);
  };

  // ── LOADING (verifying token) ──
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex
                      items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600
                          border-t-transparent rounded-full
                          animate-spin" />
          <p className="text-[#64748B] text-sm">
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  // ── INVALID TOKEN ──
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex
                      items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1    }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-500/10
                          border border-red-500/20 rounded-full
                          flex items-center justify-center
                          mx-auto mb-6">
            <AlertCircle size={36} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Link expired or invalid
          </h2>
          <p className="text-[#64748B] mb-6 leading-relaxed">
            This password reset link has expired or already been used.
            Reset links are valid for 1 hour.
          </p>
          <Link to="/forgot-password"
            className="inline-flex items-center gap-2
                       bg-violet-600 hover:bg-violet-500
                       text-white font-semibold rounded-xl
                       px-6 py-3 transition-all">
            Request New Link →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">

      {/* left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative
                      bg-gradient-to-br from-[#0A0A0F]
                      via-[#0f0a1e] to-[#0A0A0F]
                      flex-col items-center justify-center p-12">
        <div className="absolute top-1/3 left-1/2
                        -translate-x-1/2 -translate-y-1/2
                        w-80 h-80 bg-violet-600/15
                        rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="flex items-center justify-center
                          gap-3 mb-12">
            <div className="w-10 h-10 bg-violet-600 rounded-xl
                            flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold">
              HabitFlow
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Almost there!
          </h2>
          <p className="text-[#64748B] text-lg leading-relaxed">
            Choose a strong new password for your account.
          </p>
          {maskedEmail && (
            <div className="mt-6 bg-[#111118] border
                            border-[#1E1E2E] rounded-xl p-4">
              <p className="text-[#64748B] text-sm">Resetting for</p>
              <p className="text-white font-semibold mt-1">
                {maskedEmail}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* right panel */}
      <div className="w-full lg:w-1/2 flex items-center
                      justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0  }}
          className="w-full max-w-md"
        >
          {/* mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-violet-600 rounded-lg
                            flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">
              HabitFlow
            </span>
          </div>

          {!success ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  New password
                </h1>
                <p className="text-[#64748B]">
                  Must be at least 6 characters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* new password */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16}
                      className="absolute left-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[#111118] border
                                 border-[#1E1E2E] text-white
                                 placeholder-[#64748B] rounded-xl
                                 pl-11 pr-12 py-3.5
                                 focus:outline-none
                                 focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500
                                 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]
                                 hover:text-white transition-colors"
                    >
                      {showPassword
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>
                  </div>

                  {/* strength bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i}
                            className={`h-1 flex-1 rounded-full
                              transition-all duration-300
                              ${i <= strength.score
                                ? strength.color
                                : 'bg-[#1E1E2E]'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[#64748B]">
                        Strength:{' '}
                        <span className={
                          strength.label === 'Strong'
                            ? 'text-[#06FFA5]'
                            : strength.label === 'Medium'
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }>
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* confirm password */}
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16}
                      className="absolute left-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full bg-[#111118] border
                                 text-white placeholder-[#64748B]
                                 rounded-xl pl-11 pr-12 py-3.5
                                 focus:outline-none
                                 focus:ring-1 transition-all
                                 ${confirm && password !== confirm
                                   ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                   : 'border-[#1E1E2E] focus:border-violet-500 focus:ring-violet-500'
                                 }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]
                                 hover:text-white transition-colors"
                    >
                      {showConfirm
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-red-400 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-violet-600
                             hover:bg-violet-500
                             disabled:opacity-50
                             text-white font-semibold
                             rounded-xl py-3.5 transition-all
                             shadow-lg shadow-violet-600/25"
                >
                  {loading ? (
                    <span className="flex items-center
                                     justify-center gap-2">
                      <svg className="animate-spin h-4 w-4"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : 'Reset Password'}
                </motion.button>
              </form>
            </>
          ) : (
            /* ── SUCCESS ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1    }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-[#06FFA5]/15
                              border border-[#06FFA5]/30
                              rounded-full flex items-center
                              justify-center mx-auto mb-6">
                <CheckCircle size={36}
                  className="text-[#06FFA5]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Password reset! 🎉
              </h2>
              <p className="text-[#64748B] mb-6 leading-relaxed">
                Your password has been successfully changed.
                Redirecting you to login...
              </p>
              <div className="w-full h-1 bg-[#1E1E2E]
                              rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-violet-600 rounded-full"
                />
              </div>
              <Link to="/login"
                className="inline-block mt-4 text-violet-400
                           hover:text-violet-300 text-sm
                           transition-colors">
                Go to login now →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}