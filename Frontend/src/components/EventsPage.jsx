// // EventsPage.jsx (NEW FILE)
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { getAllEvents } from "../redux/eventSlice";
// import Sidebar from "./Sidebar";
// import EventsGrid from "./EventsGrid";

// const EventsPage = () => {
//   const dispatch = useDispatch();

//   const { events = [], loading, error } = useSelector(
//     (state) => state.event || {}
//   );

//   const [filteredEvents, setFilteredEvents] = useState([]);

//   useEffect(() => {
//     dispatch(getAllEvents());
//   }, [dispatch]);

//   // ✅ sync filtered events when API loads
//   useEffect(() => {
//     setFilteredEvents(events);
//   }, [events]);

//   // ✅ FILTER LOGIC (integrated)
//   const handleFilters = (filters) => {
//     let temp = [...events];

//     if (filters.category) {
//       temp = temp.filter((e) => e.category === filters.category);
//     }

//     if (filters.price) {
//       temp = temp.filter((e) =>
//         filters.price === "free" ? e.price === 0 : e.price > 0
//       );
//     }

//     if (filters.location) {
//       temp = temp.filter((e) =>
//         e.location?.toLowerCase().includes(filters.location.toLowerCase())
//       );
//     }

//     if (filters.date) {
//       temp = temp.filter((e) => e.date === filters.date);
//     }

//     setFilteredEvents(temp);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading events</div>;

//   return (
//     <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

//       {/* Sidebar */}
//       <div className="w-1/4">
//         <Sidebar onApplyFilters={handleFilters} />
//       </div>

//       {/* Events */}
//       <div className="w-3/4">
//         <EventsGrid events={filteredEvents} />
//       </div>
//     </div>
//   );
// };

// export default EventsPage;



import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Menu, X, SlidersHorizontal } from "lucide-react";
import { getAllEvents } from "../redux/eventSlice";
import Sidebar from "./Sidebar";
import EventsGrid from "./EventsGrid";

const EventsPage = () => {
  const dispatch = useDispatch();

  const { events = [], loading, error } = useSelector(
    (state) => state.event || {}
  );

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleFilters = (filters) => {
    let temp = [...events];

    if (filters.category) {
      temp = temp.filter((e) => e.category === filters.category);
    }

    if (filters.price) {
      temp = temp.filter((e) =>
        filters.price === "free" ? e.ticketPrice === 0 : e.ticketPrice > 0
      );
    }

    if (filters.location) {
      temp = temp.filter((e) =>
        e.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.date) {
      temp = temp.filter((e) => e.date === filters.date);
    }

    setFilteredEvents(temp);
    setShowFilters(false); // Close drawer after applying
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-30">
        <h2 className="font-bold text-lg">Events</h2>

        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90%] bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Filters</h2>

          <button onClick={() => setShowFilters(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <Sidebar onApplyFilters={handleFilters} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-6 p-4 md:p-6">

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-1/4">
          <Sidebar onApplyFilters={handleFilters} />
        </div>

        {/* Events */}
        <div className="w-full md:w-3/4">
          <EventsGrid events={filteredEvents} />
        </div>

      </div>
    </div>
  );
};

export default EventsPage;