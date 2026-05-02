import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">

      {/* sidebar — desktop only */}
      <Sidebar />

      {/* main content — offset by sidebar width on desktop */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* topbar */}
        <Topbar />

        {/* page content */}
        <main className="flex-1 p-4 md:p-6
                         pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}