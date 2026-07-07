import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  IndianRupee,
  ExternalLink,
  ArrowLeft,
  Minus,
  Plus,
  Star,
  Flame,
} from "lucide-react";
import axios from "axios";
// Change according to your slice
import { getSingleEvent } from "../redux/eventSlice";

const SingleEvent = () => {
  const { id } = useParams(); // Event ID from URL

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { event, loading } = useSelector((state) => state.event);

  const [quantity, setQuantity] = useState(1);

  const [people, setPeople] = useState([
    {
      name: "",
      age: "",
      gender: "Male",
    },
  ]);

  useEffect(() => {
    dispatch(getSingleEvent(id));
  }, [dispatch, id]);

  // Remaining seats
  const availableSeats = useMemo(() => {
    if (!event) return 0;

    return Math.max(event.maxUsers - event.totalTicketsSold, 0);
  }, [event]);

  // Total Amount
  const totalAmount = useMemo(() => {
    if (!event) return 0;

    return quantity * event.ticketPrice;
  }, [event, quantity]);

  // Increase Ticket
  const increaseQuantity = () => {
    if (!event) return;

    if (quantity >= availableSeats) return;

    setQuantity((prev) => prev + 1);

    setPeople((prev) => [
      ...prev,
      {
        name: "",
        age: "",
        gender: "Male",
      },
    ]);
  };

  // Decrease Ticket
  const decreaseQuantity = () => {
    if (quantity === 1) return;

    setQuantity((prev) => prev - 1);

    setPeople((prev) => prev.slice(0, -1));
  };

  // Handle Person Input
  const handlePersonChange = (index, field, value) => {
    const updated = [...people];

    updated[index][field] = value;

    setPeople(updated);
  };

  // Validate People
  const validatePeople = () => {
    for (const person of people) {
      if (!person.name) return false;
      if (!person.age) return false;
      if (!person.gender) return false;
    }

    return true;
  };

  // =========================
  // FINAL BOOKING HANDLER
  // =========================

  const handleBooking = async () => {
    try {
      if (!validatePeople()) {
        return alert("Please fill all attendee details.");
      }

      const payload = {
        eventId: id,
        quantity,
        people,
        ticketPrice: event.ticketPrice,
        totalPrice: totalAmount,
      };

      // FREE EVENT
      if (event.ticketPrice === 0) {
        const res = await fetch(
          "http://localhost:8080/api/v1/ticket/book-free",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("AccessToken"),
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          return alert(data.message);
        }

        alert("Ticket booked successfully.");

        navigate("/my-tickets");

        return;
      }
      const AccessToken = localStorage.getItem("AccessToken");
      console.log(AccessToken);
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
     
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/payment/create-session",
          payload,
          {
            headers: {
              Authorization: `Bearer ${AccessToken}`,
            },
          },
        );

        console.log("Response:", res.data);

        if (!res.data || !res.data.url) {
          return alert("Stripe URL not found");
        }

        window.location.href = res.data.url;
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // =========================
  // AUTO SYNC PEOPLE WITH QUANTITY (SAFETY NET)
  // =========================

  useEffect(() => {
    setPeople((prev) => {
      const updated = [...prev];

      if (quantity > updated.length) {
        for (let i = updated.length; i < quantity; i++) {
          updated.push({
            name: "",
            age: "",
            gender: "Male",
          });
        }
      }

      if (quantity < updated.length) {
        updated.length = quantity;
      }

      return updated;
    });
  }, [quantity]);

  // =========================
  // MOBILE UX FIX (scroll top on load)
  // =========================

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (loading || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}

      <div className="relative h-[45vh] md:h-[65vh]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-indigo-600 px-4 py-2 rounded-full text-sm">
              {event.category}
            </span>

            {event.isPromoted && (
              <span className="bg-yellow-500 text-black flex items-center gap-2 px-4 py-2 rounded-full text-sm">
                <Flame size={16} />
                Promoted
              </span>
            )}

            {event.promotionTypes?.includes("highlight") && (
              <span className="bg-pink-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <Star size={15} />
                Highlight
              </span>
            )}

            {event.promotionTypes?.includes("whatsapp") && (
              <span className="bg-green-600 px-4 py-2 rounded-full text-sm">
                WhatsApp
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold">{event.title}</h1>

          <div className="flex flex-wrap gap-5 mt-5">
            <div className="flex items-center gap-2">
              <Calendar size={20} />

              {new Date(event.startDate).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={20} />

              {new Date(event.endDate).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={20} />

              {event.location}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-5 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">
          {/* About */}

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-5">About Event</h2>

            <p className="text-gray-600 leading-8 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Location */}

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-5">Location</h2>

            <div className="flex justify-between flex-wrap gap-5">
              <div>
                <h3 className="font-semibold text-lg">{event.location}</h3>
              </div>

              {event.locationLink && (
                <a
                  href={event.locationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                  Open Map
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Stats */}

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl p-5 shadow">
              <Ticket className="text-indigo-600 mb-3" />

              <p className="text-gray-500">Ticket Price</p>

              <h2 className="text-2xl font-bold flex items-center">
                <IndianRupee size={20} />

                {event.ticketPrice}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <Users className="text-green-600 mb-3" />

              <p className="text-gray-500">Available Seats</p>

              <h2 className="text-2xl font-bold">{availableSeats}</h2>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <Ticket className="text-pink-600 mb-3" />

              <p className="text-gray-500">Tickets Sold</p>

              <h2 className="text-2xl font-bold">{event.totalTicketsSold}</h2>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <IndianRupee className="text-yellow-600 mb-3" />

              <p className="text-gray-500">Revenue</p>

              <h2 className="text-2xl font-bold">₹ {event.totalRevenue}</h2>
            </div>
          </div>

          {/* PART-2 STARTS HERE */}

          {/* RIGHT SIDEBAR - BOOKING SECTION */}

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-5 space-y-6">
              {/* Availability Warning */}
              {availableSeats === 0 ? (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg font-semibold">
                  🚫 Sold Out
                </div>
              ) : (
                <div className="bg-green-100 text-green-700 p-3 rounded-lg font-semibold">
                  🎟 {availableSeats} seats left
                </div>
              )}

              {/* Quantity Selector */}
              {event.ticketPrice > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Select Tickets</h3>

                  <div className="flex items-center justify-between border rounded-xl p-3">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 bg-gray-200 rounded-lg"
                      disabled={quantity === 1}
                    >
                      <Minus size={18} />
                    </button>

                    <span className="text-lg font-bold">{quantity}</span>

                    <button
                      onClick={increaseQuantity}
                      className="p-2 bg-indigo-600 text-white rounded-lg"
                      disabled={quantity >= availableSeats}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* People Form */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                <h3 className="font-semibold">Attendee Details</h3>

                {people.map((person, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 space-y-3 bg-gray-50"
                  >
                    <h4 className="font-semibold text-sm">
                      Person {index + 1}
                    </h4>

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={person.name}
                      onChange={(e) =>
                        handlePersonChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />

                    <input
                      type="number"
                      placeholder="Age"
                      value={person.age}
                      onChange={(e) =>
                        handlePersonChange(index, "age", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />

                    <select
                      value={person.gender}
                      onChange={(e) =>
                        handlePersonChange(index, "gender", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Ticket Price</span>
                  <span>₹{event.ticketPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Button */}
              {event.ticketPrice === 0 ? (
                <button
                  onClick={handleBooking}
                  disabled={availableSeats === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  Book Free Ticket
                </button>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={availableSeats === 0}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  Proceed To Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COMING IN PART-2 */}
      </div>
    </div>
  );
};

export default SingleEvent;
