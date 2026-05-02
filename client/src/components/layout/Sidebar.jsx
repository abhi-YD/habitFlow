import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, CheckSquare, Trophy,
  LogOut, Zap, BarChart2, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits',    icon: Target,          label: 'Habits'    },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
  { to: '/goals',     icon: Trophy,          label: 'Goals'     },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // get initials from name
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen
                      bg-[#111118] border-r border-[#1E1E2E]
                      fixed left-0 top-0 z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5
                      border-b border-[#1E1E2E]">
        <div className="w-8 h-8 bg-violet-600 rounded-lg
                        flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-white text-lg font-bold tracking-tight">
          HabitFlow
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl
               text-sm font-medium transition-all duration-200
               ${isActive
                 ? 'bg-violet-600/15 text-violet-400 border border-violet-600/20'
                 : 'text-[#64748B] hover:text-white hover:bg-[#1E1E2E]'
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive
                  ? 'text-violet-400' : 'text-[#64748B]'} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full
                               bg-violet-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* divider */}
        <div className="pt-4 mt-4 border-t border-[#1E1E2E]">
          <NavLink
            to="/analytics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-sm font-medium text-[#64748B]
                       hover:text-white hover:bg-[#1E1E2E]
                       transition-all duration-200"
          >
            <BarChart2 size={18} />
            Analytics
            <span className="ml-auto text-xs bg-violet-600/20
                             text-violet-400 px-2 py-0.5 rounded-full">
              Soon
            </span>
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-sm font-medium text-[#64748B]
                       hover:text-white hover:bg-[#1E1E2E]
                       transition-all duration-200"
          >
            <Settings size={18} />
            Settings
            <span className="ml-auto text-xs bg-violet-600/20
                             text-violet-400 px-2 py-0.5 rounded-full">
              Soon
            </span>
          </NavLink>
        </div>
      </nav>

      {/* User Profile + Logout */}
      <div className="px-3 py-4 border-t border-[#1E1E2E]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                        bg-[#0A0A0F] mb-2">
          {/* avatar */}
          <div className="w-8 h-8 rounded-full bg-violet-600/30
                          border border-violet-600/40
                          flex items-center justify-center flex-shrink-0">
            <span className="text-violet-300 text-xs font-bold">
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-[#64748B] text-xs truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5
                     rounded-xl text-sm font-medium text-[#64748B]
                     hover:text-red-400 hover:bg-red-500/10
                     transition-all duration-200"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}