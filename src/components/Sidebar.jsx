// Sidebar.jsx
import { useState } from "react";

const Sidebar = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    location: "",
    date: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      price: "",
      location: "",
      date: "",
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div     className="md:bg-white md:p-5 md:rounded-xl md:shadow-md">
      <h2 className="text-xl font-semibold mb-5">Filters</h2>

      {/* Category */}
      <div className="mb-4">
        <label className="text-sm">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-1"
        >
          <option value="">All</option>
          <option value="music">Music</option>
          <option value="tech">Tech</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="text-sm">Price</label>
        <select
          name="price"
          value={filters.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-1"
        >
          <option value="">All</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="text-sm">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Enter location"
          className="w-full border p-2 rounded-lg mt-1"
        />
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="text-sm">Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-1"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Apply
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Sidebar;