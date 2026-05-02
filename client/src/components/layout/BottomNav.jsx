import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, CheckSquare, Trophy } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home'   },
  { to: '/habits',    icon: Target,          label: 'Habits' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'  },
  { to: '/goals',     icon: Trophy,          label: 'Goals'  },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40
                    bg-[#111118] border-t border-[#1E1E2E]
                    flex items-center justify-around px-2 py-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-xl
             transition-all duration-200
             ${isActive
               ? 'text-violet-400'
               : 'text-[#64748B]'
             }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-lg transition-all
                ${isActive ? 'bg-violet-600/20' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}