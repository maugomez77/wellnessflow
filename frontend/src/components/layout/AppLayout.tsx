import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Demo banner */}
      <div className="fixed top-0 left-64 right-0 z-20 bg-teal-600 text-white text-center py-1.5 text-sm font-medium">
        Demo Mode — Sample data for illustration purposes
      </div>

      {/* Main content */}
      <main className="ml-64 pt-12 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
