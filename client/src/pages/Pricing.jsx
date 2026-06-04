import { useState } from 'react';
import { Link }     from 'react-router-dom';

const features = [
  { name: 'Habits',              free: '5 habits',      pro: 'Unlimited'         },
  { name: 'Goals',               free: '3 goals',       pro: 'Unlimited'         },
  { name: 'Tasks',               free: '✓ Basic',       pro: '✓ Advanced'        },
  { name: 'History',             free: '7 days',        pro: 'Full history'      },
  { name: 'Dashboard',           free: '✓ Basic',       pro: '✓ Full'            },
  { name: 'Analytics & Charts',  free: '✗',             pro: '✓ All charts'      },
  { name: 'AI Habit Suggestions',free: '✗',             pro: '✓ Unlimited'       },
  { name: 'AI Smart Insights',   free: '✗',             pro: '✓ Daily'           },
  { name: 'AI Task Prioritizer', free: '✗',             pro: '✓ Unlimited'       },
  { name: 'Daily Coach Message', free: '✗',             pro: '✓ Every morning'   },
  { name: 'Email Reminders',     free: '✗',             pro: '✓ Per habit'       },
  { name: 'Push Notifications',  free: '✗',             pro: '✓ Real-time'       },
  { name: 'Weekly Email Report', free: '✗',             pro: '✓ Every Sunday'    },
  { name: 'PDF Export',          free: '✗',             pro: '✓ Full report'     },
  { name: 'Year Heatmap',        free: '✗',             pro: '✓ Premium style'    },
  { name: 'Priority Support',    free: '✗',             pro: '✓ 24h response'    },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your settings. No questions asked, no hidden fees.' },
  { q: 'What happens to my data if I downgrade?', a: 'Your data is safe. If you exceed free limits, existing data stays but you cannot add more until within limits.' },
  { q: 'Is there a student discount?', a: 'Yes! Students get 50% off Pro. Email us with your institution email.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a 7-day full refund if you\'re not satisfied, no questions asked.' },
  { q: 'Which payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, Paytm, Google Pay via Razorpay.' },
  { q: 'Is my payment secure?', a: 'Yes. All payments are processed by Razorpay — PCI-DSS compliant and bank-grade secure.' },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const monthlyPrice = 199;
  const annualPrice  = Math.round(1499 / 12);
  const saving       = Math.round((1 - annualPrice / monthlyPrice) * 100);

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', fontFamily: "'DM Sans',system-ui,sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#7C3AED40;color:#fff;}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 30px rgba(124,58,237,0.3)}50%{box-shadow:0 0 60px rgba(124,58,237,0.6)}}
        .plan-card{background:#111118;border:1px solid #1E1E2E;border-radius:24px;padding:36px;transition:all 0.3s;}
        .plan-card:hover{border-color:#2E2E4E;}
        .plan-pro{background:linear-gradient(135deg,#7C3AED14,#06FFA508);border:1px solid #7C3AED35;}
        .plan-pro:hover{border-color:#7C3AED60;}
        .cta-btn{display:block;text-align:center;border-radius:13px;padding:13px;font-size:14px;font-weight:700;text-decoration:none;font-family:inherit;transition:all 0.3s;cursor:pointer;border:none;}
        .cta-free{background:#1E1E2E;color:#fff;}
        .cta-free:hover{background:#2E2E4E;}
        .cta-pro{background:#7C3AED;color:#fff;animation:pulseGlow 3s ease-in-out infinite;}
        .cta-pro:hover{background:#8B5CF6;transform:translateY(-2px);}
        .toggle-btn{padding:8px 20px;border-radius:10px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:inherit;}
        .faq-item{border-bottom:1px solid #1E1E2E;cursor:pointer;}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: '1px solid #1E1E2E', padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '30px', height: '30px', background: '#7C3AED', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '17px', fontFamily: "'Syne',sans-serif" }}>HabitFlow</span>
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login"    style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Sign in</Link>
            <Link to="/register" style={{ background: '#7C3AED', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '8px 20px', borderRadius: '10px' }}>Start Free →</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', background: '#F59E0B15', border: '1px solid #F59E0B30', borderRadius: '999px', padding: '6px 18px', marginBottom: '20px' }}>
            <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple Pricing</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: '16px' }}>
            Start free.<br />Upgrade when ready.
          </h1>
          <p style={{ color: '#64748B', fontSize: '18px', lineHeight: 1.7 }}>
            No credit card required. Cancel anytime.
          </p>

          {/* billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#111118', border: '1px solid #1E1E2E', borderRadius: '14px', padding: '4px', marginTop: '32px' }}>
            <button
              className="toggle-btn"
              onClick={() => setAnnual(false)}
              style={{ background: !annual ? '#1E1E2E' : 'transparent', color: !annual ? '#fff' : '#64748B' }}
            >Monthly</button>
            <button
              className="toggle-btn"
              onClick={() => setAnnual(true)}
              style={{ background: annual ? '#7C3AED' : 'transparent', color: annual ? '#fff' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Annual
              <span style={{ background: '#06FFA520', color: '#06FFA5', fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                Save {saving}%
              </span>
            </button>
          </div>
        </div>

        {/* ── PLAN CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginBottom: '80px', alignItems: 'start' }}>

          {/* FREE */}
          <div className="plan-card">
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: '#1E1E2E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌱</div>
                <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '52px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹0</div>
              <div style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>Forever free. No tricks.</div>
            </div>

            <Link to="/register" className="cta-btn cta-free" style={{ marginBottom: '28px' }}>
              Get Started Free →
            </Link>

            <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              What's included
            </div>
            {[
              '5 habits',
              '3 goals',
              'Basic to-do list',
              '7-day history',
              'Basic dashboard',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ color: '#06FFA5', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span style={{ color: '#64748B', fontSize: '14px' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* PRO */}
          <div className="plan-card plan-pro" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* popular badge */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#7C3AED', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
              MOST POPULAR
            </div>

            {/* glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: '#7C3AED25', border: '1px solid #7C3AED40', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🚀</div>
                <span style={{ color: '#7C3AED', fontSize: '14px', fontWeight: 600 }}>PRO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '52px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  ₹{annual ? annualPrice : monthlyPrice}
                </div>
                <div style={{ color: '#64748B', fontSize: '15px', paddingBottom: '8px' }}>/month</div>
              </div>
              {annual && (
                <div style={{ color: '#06FFA5', fontSize: '13px', marginTop: '6px', fontWeight: 500 }}>
                  Billed ₹1499/year · Save ₹{(monthlyPrice * 12) - 1499}
                </div>
              )}
              {!annual && (
                <div style={{ color: '#64748B', fontSize: '13px', marginTop: '6px' }}>
                  or ₹1499/year and save {saving}%
                </div>
              )}
            </div>

            <Link to="/register" className="cta-btn cta-pro" style={{ marginBottom: '28px' }}>
              Start Pro Free Trial →
            </Link>

            <div style={{ color: '#7C3AED', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Everything in Free, plus
            </div>
            {[
              'Unlimited habits & goals',
              'Full analytics & charts',
              'AI Habit Suggestions',
              'AI Smart Insights',
              'AI Task Prioritizer',
              'Daily Coach Message',
              'Email + Push Reminders',
              'Weekly Email Report',
              'PDF Report Export',
              'GitHub-style year heatmap',
              'Priority support (24h)',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ color: '#06FFA5', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '40px' }}>
            Full Feature Comparison
          </h2>
          <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', overflow: 'hidden' }}>
            {/* table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}>
              <div style={{ padding: '16px 24px', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Feature</div>
              <div style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '13px', fontWeight: 600, textAlign: 'center', borderLeft: '1px solid #1E1E2E' }}>Free</div>
              <div style={{ padding: '16px 24px', color: '#7C3AED', fontSize: '13px', fontWeight: 600, textAlign: 'center', borderLeft: '1px solid #1E1E2E' }}>Pro</div>
            </div>
            {features.map((f, i) => (
              <div
                key={f.name}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < features.length - 1 ? '1px solid #1E1E2E' : 'none', background: i % 2 === 0 ? 'transparent' : '#0A0A0F05' }}
              >
                <div style={{ padding: '14px 24px', color: '#94A3B8', fontSize: '14px' }}>{f.name}</div>
                <div style={{ padding: '14px 24px', textAlign: 'center', borderLeft: '1px solid #1E1E2E', color: f.free === '✗' ? '#2E2E4E' : '#64748B', fontSize: '14px', fontWeight: f.free === '✗' ? 400 : 500 }}>{f.free}</div>
                <div style={{ padding: '14px 24px', textAlign: 'center', borderLeft: '1px solid #1E1E2E', color: '#06FFA5', fontSize: '14px', fontWeight: 600 }}>{f.pro}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ maxWidth: '720px', margin: '0 auto 80px' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '40px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: '20px', overflow: 'hidden' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="faq-item"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ borderBottom: i < faqs.length - 1 ? '1px solid #1E1E2E' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
                  <span style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: 500, paddingRight: '16px' }}>{faq.q}</span>
                  <span style={{ color: '#64748B', fontSize: '20px', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', color: '#64748B', fontSize: '14px', lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#111118', borderRadius: '28px', border: '1px solid #1E1E2E', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '200px', background: 'radial-gradient(ellipse,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#fff', marginBottom: '16px', position: 'relative' }}>
            Still not sure?
          </h2>
          <p style={{ color: '#64748B', fontSize: '17px', marginBottom: '32px', lineHeight: 1.7, position: 'relative' }}>
            Start free — no credit card, no commitment.<br />Upgrade only when HabitFlow has earned it.
          </p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#7C3AED', color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 700, padding: '16px 40px', borderRadius: '14px', fontFamily: 'inherit', position: 'relative' }}>
            Create Free Account →
          </Link>
          <p style={{ color: '#2E2E4E', fontSize: '13px', marginTop: '16px' }}>
            7-day money-back guarantee on Pro
          </p>
        </div>

      </div>

      {/* footer */}
      <footer style={{ borderTop: '1px solid #1E1E2E', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '26px', height: '26px', background: '#7C3AED', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: '15px' }}>HabitFlow</span>
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Home','/'],['Features','/#features'],['Privacy','/privacy'],['Terms','/terms']].map(([l,h]) => (
              <Link key={l} to={h} style={{ color: '#64748B', fontSize: '13px', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <span style={{ color: '#2E2E4E', fontSize: '12px' }}>© 2026 HabitFlow · Built with ❤️ in India</span>
        </div>
      </footer>
    </div>
  );
}