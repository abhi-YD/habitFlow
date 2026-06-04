// import { useEffect }   from 'react';
// import { Outlet }      from 'react-router-dom';
// import Sidebar         from './Sidebar';
// import Topbar          from './Topbar';
// import BottomNav       from './BottomNav';
// import UpgradeModal    from '../ui/UpgradeModal';
// import usePlanStore    from '../../store/planStore';

// export default function Layout() {
//   const { fetchPlanStatus } = usePlanStore();

//   // ✅ fetch plan on every app load
//   useEffect(() => {
//     fetchPlanStatus();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0A0A0F]">
//       <Sidebar />
//       <div className="md:ml-64 flex flex-col min-h-screen">
//         <Topbar />
//         <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
//           <Outlet />
//         </main>
//       </div>
//       <BottomNav />
//       <UpgradeModal />  {/* ✅ always mounted */}
//     </div>
//   );
// }

import { useEffect }   from 'react';
import { Outlet }      from 'react-router-dom';
import Sidebar         from './Sidebar';
import Topbar          from './Topbar';
import BottomNav       from './BottomNav';
import UpgradeModal    from '../ui/UpgradeModal';
import usePlanStore    from '../../store/planStore';

export default function Layout() {
  const { fetchPlanStatus } = usePlanStore();

  useEffect(() => {
    fetchPlanStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <UpgradeModal />
    </div>
  );
}