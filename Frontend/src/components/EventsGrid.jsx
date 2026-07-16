

import { Link } from "react-router-dom";

const EventsGrid = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-center mt-10">No events found</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
        >
          {/* Event Image */}
          <div className="h-48 w-full overflow-hidden">
            <img
              src={event.image || "https://via.placeholder.com/400"}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-2 flex-grow">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {event.title}
            </h3>

            {/* Location */}
            <p className="text-sm text-gray-500">
              📍 {event.location || "Location not available"}
            </p>

            {/* Price */}
            <p className="text-md font-medium text-gray-700">
              {event?.price === 0 ? "Free" : `₹ ${event?.ticketPrice}`}
            </p>

            {/* Button */}
            <Link
              to={`/single-event/${event._id}`}
              className="mt-auto bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsGrid;