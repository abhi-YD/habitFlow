import { Bell, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore();

  // greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // formatted date
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  });

  return (
    <header className="h-16 bg-[#111118] border-b border-[#1E1E2E]
                       flex items-center justify-between
                       px-6 sticky top-0 z-30">

      {/* left — greeting */}
      <div>
        <h1 className="text-white font-semibold text-sm md:text-base">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-[#64748B] text-xs">{today}</p>
      </div>

      {/* right — actions */}
      <div className="flex items-center gap-3">
        {/* notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-[#0A0A0F]
                           border border-[#1E1E2E]
                           flex items-center justify-center
                           text-[#64748B] hover:text-white
                           transition-colors">
          <Bell size={16} />
          {/* notification dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5
                           bg-violet-500 rounded-full" />
        </button>

        {/* mobile menu (future use) */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-xl bg-[#0A0A0F]
                     border border-[#1E1E2E]
                     flex items-center justify-center
                     text-[#64748B] hover:text-white transition-colors"
        >
          <Menu size={16} />
        </button>
      </div>
    </header>
  );
}