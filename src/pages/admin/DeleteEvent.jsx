import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent , getAllEvents} from "../../redux/eventSlice"; //
import { toast } from "react-toastify";

const DeleteEvent = () => {
  const [events, setEvents] = useState([]);
const dispatch = useDispatch();
  const fetchEvents = async () => {
    try {
    //   const res = await axios.get(`${API}/getAllEvents`);
      const eventsData = await dispatch(getAllEvents()).unwrap();
      setEvents(eventsData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
     console.log("Event ID to delete:", id); // Debug log
    if (!confirmDelete) return;

    try {
    //   await axios.delete(`${API}/deleteEvent/${id}`);
      await dispatch(deleteEvent(id)).unwrap();
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        Admin - Manage Events
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* ✅ Event Image */}
            <img
              src={event.image}
              alt="event"
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">
                {event.title}
              </h2>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {event.description}
              </p>

              <p className="text-sm text-gray-500">
                📍 {event.location}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                📅 {event.date}
              </p>

              <button
                onClick={() => handleDelete(event._id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Delete Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No events available
        </p>
      )}
    </div>
  );
};

export default DeleteEvent;