import { useState }         from 'react';
import { Link }             from 'react-router-dom';
import { motion }           from 'framer-motion';
import { Mail, ArrowLeft,
         Zap, CheckCircle } from 'lucide-react';
import toast                from 'react-hot-toast';
import api                  from '../api/axios';

export default function ForgotPassword() {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

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
            Happens to everyone
          </h2>
          <p className="text-[#64748B] text-lg leading-relaxed">
            We'll send a secure reset link to your email.
            You'll be back on track in minutes.
          </p>
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

          {/* back link */}
          <Link to="/login"
            className="flex items-center gap-2 text-[#64748B]
                       hover:text-white transition-colors
                       text-sm mb-8">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {!sent ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Forgot password?
                </h1>
                <p className="text-[#64748B]">
                  No worries. Enter your email and we'll send
                  you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium
                                    text-[#94A3B8] mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16}
                      className="absolute left-4 top-1/2
                                 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abhi@gmail.com"
                      className="w-full bg-[#111118] border
                                 border-[#1E1E2E] text-white
                                 placeholder-[#64748B] rounded-xl
                                 pl-11 pr-4 py-3.5
                                 focus:outline-none
                                 focus:border-violet-500
                                 focus:ring-1 focus:ring-violet-500
                                 transition-all"
                    />
                  </div>
                </div>

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
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
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
                Check your inbox
              </h2>
              <p className="text-[#64748B] mb-2 leading-relaxed">
                We sent a reset link to
              </p>
              <p className="text-white font-semibold mb-6">
                {email}
              </p>

              <div className="bg-[#111118] border border-[#1E1E2E]
                              rounded-xl p-4 mb-6 text-left">
                <p className="text-[#64748B] text-sm
                               leading-relaxed">
                  💡 <strong className="text-white">
                    Didn't receive it?
                  </strong> Check your spam folder.
                  The link expires in <strong
                    className="text-white">1 hour</strong>.
                </p>
              </div>

              <button
                onClick={() => setSent(false)}
                className="text-violet-400 hover:text-violet-300
                           text-sm transition-colors"
              >
                Try a different email
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}