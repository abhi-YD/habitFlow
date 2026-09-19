// import { Bell, Menu } from 'lucide-react';
// import useAuthStore from '../../store/authStore';

// export default function Topbar({ onMenuClick }) {
//   const { user } = useAuthStore();

//   // greeting based on time
//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
//   };

//   // formatted date
//   const today = new Date().toLocaleDateString('en-IN', {
//     weekday: 'long',
//     month:   'long',
//     day:     'numeric',
//   });

//   return (
//     <header className="h-16 bg-[#111118] border-b border-[#1E1E2E]
//                        flex items-center justify-between
//                        px-6 sticky top-0 z-30">

//       {/* left — greeting */}
//       <div>
//         <h1 className="text-white font-semibold text-sm md:text-base">
//           {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
//         </h1>
//         <p className="text-[#64748B] text-xs">{today}</p>
//       </div>

//       {/* right — actions */}
//       <div className="flex items-center gap-3">
//         {/* notification bell */}
//         <button className="relative w-9 h-9 rounded-xl bg-[#0A0A0F]
//                            border border-[#1E1E2E]
//                            flex items-center justify-center
//                            text-[#64748B] hover:text-white
//                            transition-colors">
//           <Bell size={16} />
//           {/* notification dot */}
//           <span className="absolute top-2 right-2 w-1.5 h-1.5
//                            bg-violet-500 rounded-full" />
//         </button>

//         {/* mobile menu (future use) */}
//         <button
//           onClick={onMenuClick}
//           className="md:hidden w-9 h-9 rounded-xl bg-[#0A0A0F]
//                      border border-[#1E1E2E]
//                      flex items-center justify-center
//                      text-[#64748B] hover:text-white transition-colors"
//         >
//           <Menu size={16} />
//         </button>
//       </div>
//     </header>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';

// local notification store (no backend needed for now)
const useNotifications = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('habitflow_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const addNotification = (notif) => {
    const newNotif = {
      id:        Date.now(),
      title:     notif.title,
      message:   notif.message,
      type:      notif.type || 'info', // info | success | warning
      read:      false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 20);
      localStorage.setItem(
        'habitflow_notifications',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(
        'habitflow_notifications',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const markRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem(
        'habitflow_notifications',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('habitflow_notifications');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications, unreadCount,
    addNotification, markAllRead, markRead, clearAll
  };
};

const typeConfig = {
  info:    { color: 'text-blue-400',  bg: 'bg-blue-500/10',  dot: 'bg-blue-400'  },
  success: { color: 'text-[#06FFA5]', bg: 'bg-[#06FFA5]/10', dot: 'bg-[#06FFA5]' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
};

export default function Topbar() {
  const { user }   = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const {
    notifications, unreadCount,
    markAllRead, markRead, clearAll
  } = useNotifications();

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <header className="h-16 bg-[#111118] border-b border-[#1E1E2E]
                       flex items-center justify-between
                       px-6 sticky top-0 z-30">

      {/* greeting */}
      <div>
        <h1 className="text-white font-semibold text-sm md:text-base">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-[#64748B] text-xs">{today}</p>
      </div>

      {/* actions */}
      <div className="flex items-center gap-3" ref={ref}>

        {/* bell button */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-9 h-9 rounded-xl bg-[#0A0A0F]
                       border border-[#1E1E2E] flex items-center
                       justify-center text-[#64748B]
                       hover:text-white transition-colors"
          >
            <Bell size={16} />
            {/* unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1
                               min-w-[18px] h-[18px] rounded-full
                               bg-violet-600 text-white text-[10px]
                               font-bold flex items-center
                               justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* notification dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1   }}
                exit={{    opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12
                           w-80 bg-[#111118] border border-[#1E1E2E]
                           rounded-2xl shadow-2xl z-50
                           overflow-hidden"
              >
                {/* header */}
                <div className="flex items-center justify-between
                                px-4 py-3 border-b border-[#1E1E2E]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-sm">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="bg-violet-600/20 text-violet-400
                                       text-xs px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[#64748B] hover:text-violet-400
                                   transition-colors"
                        title="Mark all read"
                      >
                        <CheckCheck size={15} />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-[#64748B] hover:text-red-400
                                   transition-colors"
                        title="Clear all"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* list */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center
                                    justify-center py-10 gap-2">
                      <Bell size={24} className="text-[#2E2E4E]" />
                      <p className="text-[#64748B] text-sm">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const t = typeConfig[n.type] || typeConfig.info;
                      return (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`flex gap-3 px-4 py-3
                                      border-b border-[#1E1E2E]
                                      cursor-pointer transition-colors
                                      hover:bg-[#0A0A0F]
                                      ${!n.read ? 'bg-[#0A0A0F]' : ''}`}
                        >
                          {/* dot */}
                          <div className="flex-shrink-0 mt-1.5">
                            <div className={`w-2 h-2 rounded-full
                              ${!n.read ? t.dot : 'bg-transparent'}`}
                            />
                          </div>
                          {/* content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium
                              ${!n.read ? 'text-white' : 'text-[#94A3B8]'}`}>
                              {n.title}
                            </p>
                            <p className="text-[#64748B] text-xs
                                          mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-[#2E2E4E] text-xs mt-1">
                              {timeAgo(n.createdAt)}
                            </p>
                          </div>
                          {/* read indicator */}
                          {n.read && (
                            <Check size={12}
                              className="text-[#2E2E4E] flex-shrink-0
                                         mt-1" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-[#1E1E2E]
                                  text-center">
                    <p className="text-[#64748B] text-xs">
                      {notifications.length} total notifications
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}