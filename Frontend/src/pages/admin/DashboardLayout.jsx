// DashboardLayout.jsx
import { Outlet } from "react-router-dom";
// import Navbar from "../../components/Navbar";
import Navbar from "../../components/Navbar";
import AdminSidebar from "./AdminSidebar";

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />

      <div className="flex gap-5 p-5">
        
        {/* Sidebar */}
        <div className="w-[250px]">
          <AdminSidebar />
        </div>

        {/* Page Content */}
        <div className="flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;