import { NavLink } from "react-router-dom";
import { PlusCircle, Trash2, Ticket, IndianRupee } from "lucide-react";

const AdminSidebar = () => {

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-sm h-fit">

      <h2 className="text-lg font-semibold mb-4">Admin Controls</h2>

      <div className="space-y-2">

        <NavLink  to="/admin/add-event" className={linkClasses}>
          <PlusCircle className="w-5 h-5" />
          <span>Add Event</span>
        </NavLink>
                      
        <NavLink to="/admin/delete-event" className={linkClasses}>
          <Trash2 className="w-5 h-5" />
          <span>Delete Event</span>
        </NavLink>

        <NavLink to="/admin/tickets" className={linkClasses}>
          <Ticket className="w-5 h-5" />
          <span>Tickets</span>
        </NavLink>

        <NavLink to="/admin/revenue" className={linkClasses}>
          <IndianRupee className="w-5 h-5" />
          <span>Revenue</span>
        </NavLink>

      </div>
    </div>
  );
};

export default AdminSidebar;