import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Zap, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const perks = [
  'Track unlimited habits & goals',
  'Integrated to-do list',
  'AI-powered habit suggestions',
  'Streak tracking & analytics',
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // password strength
  const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-500' };
    return              { score, label: 'Strong', color: 'bg-[#06FFA5]' };
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome to HabitFlow 🎉');
      navigate('/dashboard');
    } else {
      toast.error('Email already registered');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">

      {/* LEFT SIDE — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-[#0A0A0F] via-[#0a0f1e] to-[#0A0A0F]
                      flex-col items-center justify-center p-12">

        {/* background glows */}
        <div className="absolute top-1/4 left-1/3
                        w-80 h-80 bg-[#06FFA5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4
                        w-72 h-72 bg-violet-600/15 rounded-full blur-3xl" />

        {/* grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                              linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

        <div className="relative z-10 w-full max-w-sm">

          {/* logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-10 h-10 bg-violet-600 rounded-xl
                            flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">
              HabitFlow
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white leading-tight mb-4"
          >
            Start your journey
            <br />
            <span className="text-[#06FFA5]">today. For free.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#64748B] text-base mb-12"
          >
            Join thousands of people building better
            habits every single day.
          </motion.p>

          {/* perks list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#06FFA5]/20
                                flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-[#06FFA5]" />
                </div>
                <span className="text-[#94A3B8] text-sm">{perk}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 p-4 rounded-xl border border-[#1E1E2E]
                       bg-[#111118]/60 backdrop-blur-sm"
          >
            <p className="text-[#94A3B8] text-sm italic">
              "HabitFlow changed how I approach my daily routine.
              Best habit tracker I've ever used."
            </p>
            <p className="text-[#64748B] text-xs mt-2">
              — Priya S., Product Designer
            </p>
          </motion.div>

        </div>
      </div>

      {/* RIGHT SIDE — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center
                      justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
        >

          {/* mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-violet-600 rounded-lg
                            flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">HabitFlow</span>
          </div>

          {/* heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create account
            </h2>
            <p className="text-[#64748B]">
              Already have an account?{' '}
              <Link to="/login"
                className="text-violet-400 hover:text-violet-300
                           transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* name */}
            <div>
              <label className="block text-sm font-medium
                                text-[#94A3B8] mb-2">
                Full name
              </label>
              <div className="relative">
                <User size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             text-[#64748B]" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Abhi"
                  className="w-full bg-[#111118] border border-[#1E1E2E]
                             text-white placeholder-[#64748B]
                             rounded-xl pl-11 pr-4 py-3.5
                             focus:outline-none focus:border-violet-500
                             focus:ring-1 focus:ring-violet-500
                             transition-all"
                />
              </div>
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-medium
                                text-[#94A3B8] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             text-[#64748B]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="abhi@gmail.com"
                  className="w-full bg-[#111118] border border-[#1E1E2E]
                             text-white placeholder-[#64748B]
                             rounded-xl pl-11 pr-4 py-3.5
                             focus:outline-none focus:border-violet-500
                             focus:ring-1 focus:ring-violet-500
                             transition-all"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium
                                text-[#94A3B8] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#111118] border border-[#1E1E2E]
                             text-white placeholder-[#64748B]
                             rounded-xl pl-11 pr-12 py-3.5
                             focus:outline-none focus:border-violet-500
                             focus:ring-1 focus:ring-violet-500
                             transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-[#64748B] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* password strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all
                          duration-300 ${i <= strength.score
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
                Confirm password
              </label>
              <div className="relative">
                <Lock size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             text-[#64748B]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full bg-[#111118] border text-white
                             placeholder-[#64748B] rounded-xl
                             pl-11 pr-12 py-3.5 focus:outline-none
                             focus:ring-1 transition-all
                             ${form.confirmPassword && form.password
                               !== form.confirmPassword
                               ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                               : 'border-[#1E1E2E] focus:border-violet-500 focus:ring-violet-500'
                             }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-[#64748B] hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* mismatch warning */}
              {form.confirmPassword &&
               form.password !== form.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-violet-600 hover:bg-violet-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl py-3.5
                         transition-all duration-200 mt-2
                         shadow-lg shadow-violet-600/25"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12"
                      r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create free account'}
            </motion.button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#1E1E2E]" />
            <span className="text-[#64748B] text-sm">or</span>
            <div className="flex-1 h-px bg-[#1E1E2E]" />
          </div>

          {/* google */}
          <button
            className="w-full bg-[#111118] border border-[#1E1E2E]
                       hover:border-[#2E2E4E] text-white font-medium
                       rounded-xl py-3.5 flex items-center
                       justify-center gap-3 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107"
                d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24
                   36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0
                   5.8 1.1 7.9 3l5.7-5.7C34.2 6.5 29.4 4 24
                   4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0
                   19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24
                   12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.5
                   29.4 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
              <path fill="#4CAF50"
                d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4
                   35.6 26.9 36.5 24 36.5c-5.2 0-9.6-3.4-11.2
                   -8.1l-6.5 5C9.5 39.4 16.2 44 24 44z"/>
              <path fill="#1976D2"
                d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3
                   5.5l6.2 5.2C41.5 35.1 44 30 44 24c0-1.3
                   -.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          {/* footer */}
          <p className="text-center text-[#64748B] text-xs mt-8">
            By creating an account, you agree to our{' '}
            <span className="text-violet-400 cursor-pointer">Terms</span>
            {' '}and{' '}
            <span className="text-violet-400 cursor-pointer">
              Privacy Policy
            </span>
          </p>

        </motion.div>
      </div>
    </div>
  );
}