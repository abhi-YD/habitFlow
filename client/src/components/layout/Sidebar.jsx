// import { NavLink, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   LayoutDashboard, Target, CheckSquare, Trophy,
//   LogOut,Sparkles, Zap, BarChart2, Settings
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import useAuthStore from '../../store/authStore';

// // import { LayoutDashboard, Target, CheckSquare,
// //          Trophy, Sparkles } from 'lucide-react';

// const navItems = [
//   { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { to: '/habits',    icon: Target,          label: 'Habits'    },
//   { to: '/tasks',     icon: CheckSquare,     label: 'Tasks'     },
//   { to: '/goals',     icon: Trophy,          label: 'Goals'     },
//   { to: '/ai',        icon: Sparkles,        label: 'AI Coach'  },
//   { to: '/analytics', icon: BarChart2,       label: 'Analytics' },
// ];

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/login');
//   };

//   // get initials from name
//   const initials = user?.name
//     ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
//     : 'U';

//   return (
//     <aside className="hidden md:flex flex-col w-64 min-h-screen
//                       bg-[#111118] border-r border-[#1E1E2E]
//                       fixed left-0 top-0 z-40">

//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-5
//                       border-b border-[#1E1E2E]">
//         <div className="w-8 h-8 bg-violet-600 rounded-lg
//                         flex items-center justify-center flex-shrink-0">
//           <Zap size={16} className="text-white" />
//         </div>
//         <span className="text-white text-lg font-bold tracking-tight">
//           HabitFlow
//         </span>
//       </div>

//       {/* Nav Links */}
//       <nav className="flex-1 px-3 py-6 space-y-1">
//         {navItems.map(({ to, icon: Icon, label }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-xl
//                text-sm font-medium transition-all duration-200
//                ${isActive
//                  ? 'bg-violet-600/15 text-violet-400 border border-violet-600/20'
//                  : 'text-[#64748B] hover:text-white hover:bg-[#1E1E2E]'
//                }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <Icon size={18} className={isActive
//                   ? 'text-violet-400' : 'text-[#64748B]'} />
//                 {label}
//                 {isActive && (
//                   <motion.div
//                     layoutId="activeNav"
//                     className="ml-auto w-1.5 h-1.5 rounded-full
//                                bg-violet-400"
//                   />
//                 )}
//               </>
//             )}
//           </NavLink>
//         ))}

//         {/* divider */}
//         <div className="pt-4 mt-4 border-t border-[#1E1E2E]">
//           <NavLink
//             to="/settings"
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-xl
//               text-sm font-medium text-[#64748B]
//               hover:text-white hover:bg-[#1E1E2E]
//               transition-all duration-200
//               ${isActive
//                 ? 'bg-violet-600/15 text-violet-400 border border-violet-600/20'
//                 : ''}`
//             }
//           >
//             <Settings size={18} />
//             Settings
//           </NavLink>
//         </div>
//       </nav>

//       {/* User Profile + Logout */}
//       <div className="px-3 py-4 border-t border-[#1E1E2E]">
//         <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
//                         bg-[#0A0A0F] mb-2">
//           {/* avatar */}
//           <div className="w-8 h-8 rounded-full bg-violet-600/30
//                           border border-violet-600/40
//                           flex items-center justify-center flex-shrink-0">
//             <span className="text-violet-300 text-xs font-bold">
//               {initials}
//             </span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-white text-sm font-medium truncate">
//               {user?.name || 'User'}
//             </p>
//             <p className="text-[#64748B] text-xs truncate">
//               {user?.email || ''}
//             </p>
//           </div>
//         </div>

//         {/* logout */}
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-2.5
//                      rounded-xl text-sm font-medium text-[#64748B]
//                      hover:text-red-400 hover:bg-red-500/10
//                      transition-all duration-200"
//         >
//           <LogOut size={18} />
//           Log out
//         </button>
//       </div>
//     </aside>
//   );
// }


import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, CheckSquare,
  Trophy, LogOut, Sparkles, Zap,
  BarChart2, Settings, ShieldCheck
} from 'lucide-react';
import toast        from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import usePlanStore from '../../store/planStore';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/habits',    icon: Target,           label: 'Habits'    },
  { to: '/app/tasks',     icon: CheckSquare,      label: 'Tasks'     },
  { to: '/app/goals',     icon: Trophy,           label: 'Goals'     },
  { to: '/app/ai',        icon: Sparkles,         label: 'AI Coach'  },
  { to: '/app/analytics', icon: BarChart2,        label: 'Analytics' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout }    = useAuthStore();
  const { plan, openUpgradeModal } = usePlanStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

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

        {/* divider — Settings & Admin */}
        <div className="pt-4 mt-4 border-t border-[#1E1E2E] space-y-1">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium text-[#64748B]
              hover:text-white hover:bg-[#1E1E2E]
              transition-all duration-200
              ${isActive
                ? 'bg-violet-600/15 text-violet-400 border border-violet-600/20'
                : ''}`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
          
          {user?.role === 'admin' && (
            <NavLink
              to="/app/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium text-[#64748B]
                hover:text-white hover:bg-[#1E1E2E]
                transition-all duration-200
                ${isActive
                  ? 'bg-violet-600/15 text-violet-400 border border-violet-600/20'
                  : ''}`
              }
            >
              <ShieldCheck size={18} />
              Admin Panel
            </NavLink>
          )}
        </div>
      </nav>

      {/* User Profile + Plan + Logout */}
      <div className="px-3 py-4 border-t border-[#1E1E2E]">
        <div className="flex items-center gap-3 px-3 py-2.5
                        rounded-xl bg-[#0A0A0F] mb-2">
          {/* avatar */}
          <div className="w-8 h-8 rounded-full bg-violet-600/30
                          border border-violet-600/40
                          flex items-center justify-center
                          flex-shrink-0">
            <span className="text-violet-300 text-xs font-bold">
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            {/* plan badge */}
            <span className={`text-xs font-semibold
              ${plan === 'pro'
                ? 'text-[#06FFA5]'
                : 'text-[#64748B]'}`}>
              {plan === 'pro' ? '👑 Pro Plan' : 'Free Plan'}
            </span>
          </div>

          {/* upgrade button — free only */}
          {plan !== 'pro' && (
            <button
              onClick={() => openUpgradeModal('Upgrade to unlock all features')}
              className="text-xs bg-violet-600/20 text-violet-400
                         hover:bg-violet-600/30 px-2 py-1
                         rounded-lg transition-colors flex-shrink-0"
            >
              ↑ Pro
            </button>
          )}
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