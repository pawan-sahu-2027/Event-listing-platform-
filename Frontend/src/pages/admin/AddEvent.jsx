
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, createAdvertisementSession } from "../../redux/eventSlice";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const AddEvent = () => {
  const dispatch = useDispatch();
  // const useEffect =  useEffect;

    const fileRef = useRef(null);

  const [searchParams] = useSearchParams();

  const { loading } = useSelector((state) => state.event);
  const initialState = {
    title: "",
    description: "",
    location: "",
    locationLink: "",
    category: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
    maxUsers: "",
    image: null,
  };  
    const [formData, setFormData] = useState(initialState);

  const [showPopup, setShowPopup] = useState(false);

  const [coupon, setCoupon] = useState("");

  const [discount, setDiscount] = useState(0);
  const API_URL = "https://z80x8c7mx3.execute-api.ap-south-1.amazonaws.com";
  const [promotion, setPromotion] = useState({
    highlight: false,

    whatsapp: false,
  });


  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled");
    }
  }, []);

  localStorage.setItem(
    "eventDraft",
    JSON.stringify({
      formData,
      promotion,
      coupon,
      discount,
    }),
  );
  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment === "cancelled") {
      toast.error("Payment Cancelled");
    }
  }, [searchParams]);

  useEffect(() => {
    const draft = localStorage.getItem("eventDraft");

    if (draft) {
      const parsed = JSON.parse(draft);

      setFormData(parsed.formData);
      setPromotion(parsed.promotion);
      setCoupon(parsed.coupon || "");
      setDiscount(parsed.discount || 0);
    }
  }, []);




  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,

        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,

        [name]: value,
      }));
    }
  };

  const getDays = () => {
    if (!formData.endDate) return 0;

    const today = new Date();

    const end = new Date(formData.endDate);

    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    return diff > 0 ? diff : 0;
  };

  const calculateTotal = () => {
    let total = 0;

    const days = getDays();

    if (promotion.highlight) {
      total += 100 * days;
    }

    if (promotion.whatsapp) {
      total += 1000;
    }

    return Math.max(total - discount, 0);
  };
  const applyCoupon = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/payment/apply-coupon`,

        {
          code: coupon,
        },
      );

      if (res.data.success) {
        setDiscount(res.data.discount);

        toast.success("Coupon Applied");
      } else {
        setDiscount(0);

        toast.error("Invalid Coupon");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Coupon Error");
    }
  };

  // 🔥 Final submit

  const startStripePayment = async () => {
    try {
      const amount = calculateTotal();

      const advertisementData = {
        promotionTypes: [
          ...(promotion.highlight ? ["highlight"] : []),
          ...(promotion.whatsapp ? ["whatsapp"] : []),
        ],
        planType:
          promotion.highlight && promotion.whatsapp ? "premium" : "basic",
        price: amount,
        startDate: new Date(),
        endDate: formData.endDate,
      };

      // window.location.href = response.url;
      const data = new FormData();

      // Event fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Payment amount
      data.append("amount", calculateTotal());

      // Advertisement info
      data.append(
        "advertisementData",
        JSON.stringify({
          promotionTypes: [
            ...(promotion.highlight ? ["highlight"] : []),
            ...(promotion.whatsapp ? ["whatsapp"] : []),
          ],
          planType:
            promotion.highlight && promotion.whatsapp ? "premium" : "basic",
          price: calculateTotal(),
          startDate: new Date(),
          endDate: formData.endDate,
        }),
      );
      const response = await dispatch(
        createAdvertisementSession(data),
      ).unwrap();
      localStorage.removeItem("eventDraft");
      window.location.href = response.url;
    } catch (error) {
      toast.error(error.message || "Payment Failed");
    }
  };

  const prepareFormData = () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    return data;
  };
  const createFreeEvent = async () => {
    try {
      const data = prepareFormData();

      await dispatch(addEvent(data)).unwrap();

      toast.success("Event Created");

      localStorage.removeItem("eventDraft");

      setFormData(initialState);

      setPromotion({
        highlight: false,

        whatsapp: false,
      });

      setCoupon("");

      setDiscount(0);

      setShowPopup(false);

      fileRef.current.value = "";
    } catch (error) {
      toast.error(error);
    }
  };

  const handleContinue = async () => {
    const total = calculateTotal();

    if (total === 0) {
      await createFreeEvent();
    } else {
      await startStripePayment();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.endDate) {
      toast.error("Select End Date");

      return;
    }

    setShowPopup(true);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Event</h2>

      {/* 🔥 FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          name="locationLink"
          placeholder="Google Map Link"
          value={formData.locationLink}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Music">Music</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
        </select>

        <div className="flex gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        {/*           
          ticketPrice: "",
    maxUsers: "", */}
        <div className="flex gap-4">
          <input
            name="ticketPrice"
            placeholder="Ticket Price"
            value={formData.ticketPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <input
            name="maxUsers"
            placeholder="Max Users"
            value={formData.maxUsers}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <input
          type="file"
          name="image"
          onChange={handleChange}
          ref={fileRef}
          className="w-full p-2 border rounded-lg bg-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* 🔥 POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[92vh] bg-white rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.25)] flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

              <h2 className="text-3xl font-bold">🚀 Promote Your Event</h2>

              <p className="text-indigo-100 mt-2">
                Reach more people and maximize registrations.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span>📅</span>
                <span>{getDays()} Days Promotion Period</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <h3 className="text-xl font-bold mb-6">
                Choose Promotion Package
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Highlight Card */}
                <div
                  className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer
          ${
            promotion.highlight
              ? "border-violet-500 bg-violet-50"
              : "border-gray-200 bg-white"
          }`}
                  onClick={() =>
                    setPromotion((prev) => ({
                      // ...promotion,
                      ...prev,
                      highlight: !promotion.highlight,
                    }))
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-4xl mb-4">⭐</div>

                      <h4 className="text-xl font-bold">Highlight Listing</h4>

                      <p className="text-gray-500 mt-2">
                        Show your event at the top of listings and search
                        results.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={promotion.highlight}
                      readOnly
                      className="w-5 h-5 accent-violet-600"
                    />
                  </div>

                  <div className="mt-6">
                    <span className="text-3xl font-bold">₹100</span>
                    <span className="text-gray-500"> / day</span>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div
                  className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer
          ${
            promotion.whatsapp
              ? "border-green-500 bg-green-50"
              : "border-gray-200 bg-white"
          }`}
                  onClick={() =>
                    setPromotion((prev) => ({
                      ...prev,

                      whatsapp: !prev.whatsapp,
                    }))
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-4xl mb-4">📲</div>

                      <h4 className="text-xl font-bold">WhatsApp Campaign</h4>

                      <p className="text-gray-500 mt-2">
                        Send promotional WhatsApp messages to registered users.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={promotion.whatsapp}
                      readOnly
                      className="w-5 h-5 accent-green-600"
                    />
                  </div>

                  <div className="mt-6">
                    <span className="text-3xl font-bold">₹1000</span>
                    <span className="text-gray-500"> one-time</span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-200">
                <h4 className="font-bold text-lg mb-4">🎁 Coupon Code</h4>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-6 py-3 bg-violet-600 text-white rounded-2xl hover:bg-violet-700"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6">
                <h4 className="text-lg font-bold mb-4">Payment Summary</h4>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-400">- ₹{discount}</span>
                  </div>

                  <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                    <span className="text-xl font-semibold">Total Amount</span>

                    <span className="text-4xl font-bold">
                      ₹{calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t p-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={createFreeEvent}
                  className="flex-1 py-4 rounded-2xl border font-semibold hover:bg-gray-100"
                >
                  Skip Promotion
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEvent;
