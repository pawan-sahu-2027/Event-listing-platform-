// EventsPage.jsx (NEW FILE)
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEvents } from "../redux/eventSlice";
import Sidebar from "./Sidebar";
import EventsGrid from "./EventsGrid";

const EventsPage = () => {
  const dispatch = useDispatch();

  const { events = [], loading, error } = useSelector(
    (state) => state.event || {}
  );

  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // ✅ sync filtered events when API loads
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // ✅ FILTER LOGIC (integrated)
  const handleFilters = (filters) => {
    let temp = [...events];

    if (filters.category) {
      temp = temp.filter((e) => e.category === filters.category);
    }

    if (filters.price) {
      temp = temp.filter((e) =>
        filters.price === "free" ? e.price === 0 : e.price > 0
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
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <div className="w-1/4">
        <Sidebar onApplyFilters={handleFilters} />
      </div>

      {/* Events */}
      <div className="w-3/4">
        <EventsGrid events={filteredEvents} />
      </div>
    </div>
  );
};

export default EventsPage;