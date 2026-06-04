import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── HOOKS ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTypewriter(words, speed = 80, pause = 2200) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setWordIdx(i => i + 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, speed, pause]);
  return text;
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── ANIMATED DASHBOARD MOCKUP ──────────────────────────
function DashboardMockup() {
  const [checked, setChecked] = useState([true, false, true, false]);
  const [score, setScore] = useState(50);
  const habits = [
    { name: 'Meditate', icon: '🧘', color: '#7C3AED' },
    { name: 'Drink Water', icon: '💧', color: '#06FFA5' },
    { name: 'Morning Run', icon: '🏃', color: '#F59E0B' },
    { name: 'Read 20 mins', icon: '📚', color: '#3B82F6' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setChecked(prev => {
        const next = [...prev];
        const first = next.findIndex(v => !v);
        if (first !== -1) {
          next[first] = true;
          setScore(Math.round((next.filter(Boolean).length / next.length) * 100));
        } else {
          setScore(0);
          return [false, false, false, false];
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const ringColor = score >= 80 ? '#06FFA5' : score >= 50 ? '#7C3AED' : '#F59E0B';

  return (
    <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '22px', width: '100%', maxWidth: '400px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.1)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', background: '#7C3AED', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>⚡</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>HabitFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
        </div>
      </div>
      {/* score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#0A0A0F', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
        <svg width="76" height="76" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
          <circle cx="38" cy="38" r={r} fill="none" stroke="#1E1E2E" strokeWidth="7" />
          <circle cx="38" cy="38" r={r} fill="none" stroke={ringColor} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 5px ${ringColor})` }}
          />
        </svg>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: ringColor, transition: 'color 0.5s' }}>{score}%</div>
          <div style={{ color: '#64748B', fontSize: '11px' }}>Daily Score</div>
          <div style={{ color: '#94A3B8', fontSize: '11px', marginTop: '6px' }}>{checked.filter(Boolean).length}/{habits.length} habits done</div>
          <div style={{ fontSize: '11px', marginTop: '3px', color: score === 100 ? '#06FFA5' : '#F59E0B' }}>
            {score === 100 ? '🔥 Crushing it!' : '⚡ Keep going!'}
          </div>
        </div>
      </div>
      {/* habit list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {habits.map((h, i) => (
          <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 11px', borderRadius: '11px', background: checked[i] ? `${h.color}10` : '#0A0A0F', border: `1px solid ${checked[i] ? `${h.color}30` : '#1E1E2E'}`, transition: 'all 0.4s ease' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: checked[i] ? h.color : 'transparent', border: `2px solid ${checked[i] ? h.color : '#2E2E4E'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}>
              {checked[i] && <span style={{ fontSize: '11px', color: '#000' }}>✓</span>}
            </div>
            <span style={{ fontSize: '13px' }}>{h.icon}</span>
            <span style={{ color: checked[i] ? '#64748B' : '#F8FAFC', fontSize: '12px', fontWeight: 500, flex: 1, textDecoration: checked[i] ? 'line-through' : 'none', transition: 'all 0.3s' }}>{h.name}</span>
            {checked[i] && <span style={{ fontSize: '10px', color: h.color, background: `${h.color}15`, padding: '1px 7px', borderRadius: '999px' }}>done</span>}
          </div>
        ))}
      </div>
      {/* streak bar */}
      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', padding: '11px', background: '#0A0A0F', borderRadius: '11px', border: '1px solid #1E1E2E' }}>
        {[{ v: '🔥 7', l: 'Streak', c: '#F97316' }, { v: `${score}%`, l: 'This Week', c: '#06FFA5' }, { v: '12d', l: 'Best', c: '#7C3AED' }].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ color: '#64748B', fontSize: '10px' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI MOCKUP ──────────────────────────────────────────
function AIMockup() {
  const [step, setStep] = useState(0);
  const items = [
    { icon: '🏃', name: 'Morning Run', reason: 'Boosts metabolism', color: '#06FFA5' },
    { icon: '🧘', name: 'Meditate 10min', reason: 'Reduces cortisol', color: '#7C3AED' },
    { icon: '💧', name: 'Drink 8 glasses', reason: 'Essential for energy', color: '#3B82F6' },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s >= items.length ? 0 : s + 1)), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '22px', width: '100%', maxWidth: '400px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(6,255,165,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#7C3AED,#06FFA5)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✨</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>AI Coach</div>
          <div style={{ color: '#64748B', fontSize: '11px' }}>Groq · Llama 3.3 70B</div>
        </div>
      </div>
      <div style={{ background: '#0A0A0F', borderRadius: '11px', padding: '12px', marginBottom: '14px', border: '1px solid #1E1E2E' }}>
        <div style={{ color: '#64748B', fontSize: '11px', marginBottom: '6px' }}>Your goal</div>
        <div style={{ color: '#F8FAFC', fontSize: '12px', fontStyle: 'italic' }}>"I want to feel more energetic and focused"</div>
      </div>
      <div style={{ color: '#64748B', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>AI Habit Plan</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {items.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 11px', borderRadius: '11px', background: i < step ? `${s.color}08` : '#0A0A0F', border: `1px solid ${i < step ? `${s.color}25` : '#1E1E2E'}`, transition: 'all 0.5s ease', opacity: i < step ? 1 : 0.35, transform: i < step ? 'translateX(0)' : 'translateX(-8px)' }}>
            <span style={{ fontSize: '16px' }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: '#64748B', fontSize: '10px' }}>{s.reason}</div>
            </div>
            {i < step && <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#000', flexShrink: 0 }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', padding: '10px', background: '#7C3AED12', border: '1px solid #7C3AED22', borderRadius: '11px' }}>
        <div style={{ color: '#7C3AED', fontSize: '10px', fontWeight: 600, marginBottom: '3px' }}>💡 First Week Tip</div>
        <div style={{ color: '#94A3B8', fontSize: '11px', lineHeight: 1.5 }}>Start with one habit. Add more as you build momentum.</div>
      </div>
    </div>
  );
}

// ── ANALYTICS MOCKUP ───────────────────────────────────
function AnalyticsMockup() {
  const bars = [45, 70, 55, 90, 65, 80, 100];
  const days = ['M','T','W','T','F','S','S'];
  const [animated, setAnimated] = useState(false);
  const [ref, inView] = useInView(0.3);
  useEffect(() => { if (inView) setTimeout(() => setAnimated(true), 200); }, [inView]);

  return (
    <div ref={ref} style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '22px', width: '100%', maxWidth: '400px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>Weekly Analytics</div>
        <div style={{ color: '#64748B', fontSize: '11px' }}>Completion rate this week</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px', marginBottom: '6px' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', borderRadius: '5px 5px 0 0', background: h === 100 ? '#06FFA5' : h >= 70 ? '#7C3AED' : '#1E1E2E', height: animated ? `${h}%` : '0%', transition: `height 0.8s ease ${i * 0.09}s`, boxShadow: h === 100 ? '0 0 10px #06FFA570' : h >= 70 ? '0 0 7px #7C3AED50' : 'none' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {days.map((d, i) => <div key={i} style={{ flex: 1, textAlign: 'center', color: '#64748B', fontSize: '10px' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px' }}>
        {[{ label: 'Avg Score', value: '72%', color: '#7C3AED' }, { label: 'Best Day', value: 'Sun', color: '#06FFA5' }, { label: 'Streak', value: '7d 🔥', color: '#F97316' }].map(s => (
          <div key={s.label} style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '9px', padding: '9px', textAlign: 'center' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: '14px' }}>{s.value}</div>
            <div style={{ color: '#64748B', fontSize: '10px', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────
export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const typeText = useTypewriter(['actually stick.', 'change your life.', 'build momentum.', 'make you proud.'], 70, 2200);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const features = [
    { icon: '🎯', title: 'Smart Habit Tracking', desc: 'Daily, weekly, or custom schedules. Set targets, track streaks, and watch your completion rate climb. Every check-off feels satisfying.', color: '#7C3AED', mockup: <DashboardMockup /> },
    { icon: '🤖', title: 'AI Coach That Actually Helps', desc: 'Tell your goal — get a science-backed habit plan instantly. Your AI coach analyzes your patterns and gives personalized advice every morning.', color: '#06FFA5', mockup: <AIMockup /> },
    { icon: '📊', title: 'Beautiful Analytics', desc: "See exactly where you're winning and where to improve. GitHub-style year heatmap, weekly trends, day-of-week analysis, and exportable PDF reports.", color: '#F59E0B', mockup: <AnalyticsMockup /> },
  ];

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#7C3AED40;color:#fff;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0A0A0F;}
        ::-webkit-scrollbar-thumb{background:#1E1E2E;border-radius:4px;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 30px rgba(124,58,237,0.3)}50%{box-shadow:0 0 60px rgba(124,58,237,0.6)}}
        .float{animation:float 4s ease-in-out infinite;}
        .floatB{animation:floatB 5s ease-in-out infinite 1s;}
        .gradient-text{
          background:linear-gradient(135deg,#fff 0%,#7C3AED 40%,#06FFA5 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .cursor{animation:blink 1s ease-in-out infinite;color:#7C3AED;}
        .cta-primary{
          display:inline-flex;align-items:center;gap:8px;
          background:#7C3AED;color:#fff;border:none;border-radius:14px;
          padding:14px 32px;font-size:15px;font-weight:700;
          cursor:pointer;transition:all 0.3s;text-decoration:none;
          font-family:inherit;animation:pulseGlow 3s ease-in-out infinite;
        }
        .cta-primary:hover{background:#8B5CF6;transform:translateY(-2px);box-shadow:0 20px 40px rgba(124,58,237,0.5);}
        .cta-secondary{
          display:inline-flex;align-items:center;gap:8px;
          color:#94A3B8;border:1px solid #1E1E2E;border-radius:14px;
          padding:14px 24px;font-size:15px;font-weight:500;
          cursor:pointer;transition:all 0.3s;text-decoration:none;
          font-family:inherit;background:#111118;
        }
        .cta-secondary:hover{border-color:#2E2E4E;color:#fff;}
        .nav-link{color:#64748B;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s;}
        .nav-link:hover{color:#fff;}
        .feature-card{background:#111118;border:1px solid #1E1E2E;border-radius:24px;padding:40px;transition:border-color 0.3s;}
        .feature-card:hover{border-color:#2E2E4E;}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrollY > 50 ? 'rgba(10,10,15,0.95)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none', borderBottom: scrollY > 50 ? '1px solid #1E1E2E' : 'none', transition: 'all 0.3s', padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#7C3AED', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px', fontFamily: "'Syne', sans-serif" }}>HabitFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <Link to="/pricing" className="nav-link">Pricing</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Sign in</Link>
            <Link to="/register" className="cta-primary" style={{ padding: '10px 22px', fontSize: '14px', animation: 'none' }}>Start Free →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* bg effects */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,255,165,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '56px', position: 'relative', zIndex: 1 }}>
          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#7C3AED15', border: '1px solid #7C3AED30', borderRadius: '999px', padding: '6px 18px' }}>
            <span style={{ width: '7px', height: '7px', background: '#06FFA5', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #06FFA5' }} />
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>AI-powered habit tracker — free to start</span>
          </div>

          {/* headline */}
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: 800, lineHeight: 1.04, color: '#fff', marginBottom: '6px' }}>
              Build habits that
            </h1>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: 800, lineHeight: 1.04, minHeight: '1.1em' }}>
              <span className="gradient-text">{typeText}</span>
              <span className="cursor">|</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: 'clamp(16px, 2vw, 20px)', marginTop: '28px', lineHeight: 1.75, maxWidth: '560px', margin: '28px auto 0' }}>
              Track habits, crush goals, and get personalized AI coaching — all in one beautiful app. No spreadsheets. No complexity. Just results.
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="cta-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>Start for free →</Link>
            <a href="#features" className="cta-secondary" style={{ fontSize: '16px', padding: '16px 28px' }}>See how it works ↓</a>
          </div>

          {/* social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['#7C3AED','#06FFA5','#F59E0B','#EF4444','#3B82F6'].map((c, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: '2px solid #0A0A0F', marginLeft: i > 0 ? '-8px' : 0, opacity: 0.8 }} />
              ))}
            </div>
            <span style={{ color: '#64748B', fontSize: '14px' }}><span style={{ color: '#fff', fontWeight: 600 }}>10,000+</span> building better habits</span>
            <span style={{ fontSize: '14px' }}>⭐⭐⭐⭐⭐</span>
            <span style={{ color: '#64748B', fontSize: '13px' }}>4.9/5</span>
          </div>

          {/* hero mockup */}
          <div className="float" style={{ width: '100%', maxWidth: '440px' }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '16px' }}>
          {[
            { value: '10K+', label: 'Active Users', color: '#7C3AED' },
            { value: '2M+',  label: 'Habits Tracked', color: '#06FFA5' },
            { value: '95%',  label: 'Streak Rate', color: '#F59E0B' },
            { value: '4.9★', label: 'Rating', color: '#EF4444' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '34px', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROBLEM vs SOLUTION ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px', alignItems: 'stretch' }}>
          <Reveal>
            <div style={{ background: '#111118', border: '1px solid #EF444420', borderRadius: '24px', padding: '40px', height: '100%' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>😤</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 700, color: '#EF4444', marginBottom: '24px' }}>The Old Way</h3>
              {['Boring spreadsheets that you stop updating', 'Apps with 100 features you never use', 'You forget to track — streaks die in a week', 'No insights on what actually works for you', 'Habits and tasks living in different apps'].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#EF4444', flexShrink: 0 }}>✗</span>
                  <span style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ background: '#111118', border: '1px solid #06FFA520', borderRadius: '24px', padding: '40px', height: '100%' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 700, color: '#06FFA5', marginBottom: '24px' }}>HabitFlow</h3>
              {['Beautiful app designed for daily use', 'Focused only on what matters — your habits', 'Smart reminders + AI coaching that keep you on track', 'Deep analytics show exactly where you improve', 'Habits + tasks unified in one dashboard'].map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#06FFA5', flexShrink: 0 }}>✓</span>
                  <span style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-block', background: '#7C3AED15', border: '1px solid #7C3AED30', borderRadius: '999px', padding: '6px 18px', marginBottom: '16px' }}>
                <span style={{ color: '#7C3AED', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}>
                Everything you need.<br />Nothing you don't.
              </h2>
              <p style={{ color: '#64748B', fontSize: '18px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
                Built for people serious about change — not just tracking.
              </p>
            </div>
          </Reveal>

          {features.map((f, i) => (
            <Reveal key={f.title} delay={0.1}>
              <div className="feature-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '48px', alignItems: 'center' }}>
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>{f.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>{f.desc}</p>
                  <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: f.color, fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Try it free →</Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', order: i % 2 === 0 ? 1 : 0 }} className={i % 2 === 0 ? 'float' : 'floatB'}>
                  {f.mockup}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: '#111118' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ display: 'inline-block', background: '#06FFA515', border: '1px solid #06FFA530', borderRadius: '999px', padding: '6px 18px', marginBottom: '16px' }}>
                <span style={{ color: '#06FFA5', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>How it Works</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#fff' }}>Up and running in 2 minutes</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '20px' }}>
            {[
              { num: '01', title: 'Add your habits', desc: 'Choose from AI suggestions or create your own. Set schedule, reminder time, and daily target. Done in 30 seconds.' },
              { num: '02', title: 'Check in daily', desc: 'Open the app, check off habits. Watch your score ring fill. Build a streak you\'re proud of.' },
              { num: '03', title: 'Let AI guide you', desc: 'Get personalized morning messages, smart weekly insights, and reports straight to your inbox.' },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 0.15}>
                <div style={{ position: 'relative', background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '32px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '16px', right: '20px', fontFamily: "'Syne',sans-serif", fontSize: '72px', fontWeight: 800, color: '#ffffff04', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#7C3AED18', border: '1px solid #7C3AED28', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '14px' }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>People love HabitFlow</h2>
              <p style={{ color: '#64748B', fontSize: '16px' }}>Real stories from real users</p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '20px' }}>
            {[
              { name: 'Priya S.', role: 'Product Designer', quote: 'HabitFlow replaced 3 apps for me. The AI coach gives real advice, not generic tips.', avatar: '👩', color: '#7C3AED' },
              { name: 'Rahul M.', role: 'Software Engineer', quote: 'Finally hit my 30-day streak. Analytics helped me see I perform best in the morning.', avatar: '🧔', color: '#06FFA5' },
              { name: 'Ananya K.', role: 'Student', quote: 'The AI habit suggestions got me started when I had no idea what to track. Game changer.', avatar: '👱', color: '#F59E0B' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px' }}>{'⭐'.repeat(5)}</div>
                  <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #1E1E2E', paddingTop: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${t.color}25`, border: `1px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{t.avatar}</div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{t.name}</div>
                      <div style={{ color: '#64748B', fontSize: '12px' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section style={{ padding: '80px 24px', background: '#111118' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'inline-block', background: '#F59E0B15', border: '1px solid #F59E0B30', borderRadius: '999px', padding: '6px 18px', marginBottom: '16px' }}>
                <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Start free. Upgrade when ready.</h2>
              <p style={{ color: '#64748B', fontSize: '16px' }}>No credit card required.</p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
            <Reveal delay={0.1}>
              <div style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: '24px', padding: '32px' }}>
                <div style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>FREE</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>₹0</div>
                <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>Forever free</div>
                {['Up to 5 habits', 'Basic to-do list', '7-day history', 'Basic dashboard'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ color: '#06FFA5' }}>✓</span>
                    <span style={{ color: '#64748B', fontSize: '14px' }}>{f}</span>
                  </div>
                ))}
                <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '12px', background: '#1E1E2E', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Get Started Free</Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ background: 'linear-gradient(135deg,#7C3AED12,#06FFA508)', border: '1px solid #7C3AED35', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#7C3AED', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>POPULAR</div>
                <div style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>PRO</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>₹199<span style={{ fontSize: '18px', color: '#64748B', fontFamily: 'inherit' }}>/mo</span></div>
                <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>or ₹1499/year — save 37%</div>
                {['Unlimited habits & goals', 'AI Coach (all features)', 'Full analytics + PDF export', 'Email + push reminders', 'Priority support'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ color: '#06FFA5' }}>✓</span>
                    <span style={{ color: '#94A3B8', fontSize: '14px' }}>{f}</span>
                  </div>
                ))}
                <Link to="/pricing" className="cta-primary" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '13px', animation: 'none' }}>See Full Pricing →</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />
        <Reveal>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(36px,6vw,68px)', fontWeight: 800, color: '#fff', lineHeight: 1.04, marginBottom: '20px' }}>
              Ready to build better habits?
            </h2>
            <p style={{ color: '#64748B', fontSize: '18px', marginBottom: '40px', lineHeight: 1.75 }}>
              Join thousands of people who are tracking, improving, and achieving their goals with HabitFlow.
            </p>
            <Link to="/register" className="cta-primary" style={{ fontSize: '18px', padding: '18px 52px' }}>
              Create Free Account →
            </Link>
            <p style={{ color: '#2E2E4E', fontSize: '13px', marginTop: '20px' }}>
              No credit card required · Free forever · Cancel anytime
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1E1E2E', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: '#7C3AED', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>HabitFlow</span>
            <span style={{ color: '#2E2E4E', fontSize: '13px' }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Features','#features'],['Pricing','/pricing'],['Privacy','/privacy'],['Terms','/terms']].map(([l, h]) => (
              h.startsWith('#')
                ? <a key={l} href={h} style={{ color: '#64748B', fontSize: '13px', textDecoration: 'none' }}>{l}</a>
                : <Link key={l} to={h} style={{ color: '#64748B', fontSize: '13px', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ color: '#2E2E4E', fontSize: '12px' }}>Built with ❤️ in India</div>
        </div>
      </footer>
    </div>
  );
}