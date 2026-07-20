import { useEffect, useState } from "react";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";

export default function TicketSuccess() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.href = "https://www.event-booking.live/";
    }, 3000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-lg w-full p-8 text-center animate-in fade-in zoom-in duration-500">

        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle
            size={90}
            className="text-green-500 animate-bounce"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6">
          Ticket Booked Successfully!
        </h1>

        <p className="text-gray-600 mt-4 text-base md:text-lg">
          Thank you for booking with us.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6 flex items-start gap-3">
          <Mail className="text-green-600 mt-1" size={28} />
          <div className="text-left">
            <h3 className="font-semibold text-green-700">
              Ticket Sent Successfully
            </h3>
            <p className="text-gray-600 text-sm">
              Your ticket PDF has been sent to your registered Gmail address.
              Please check your Inbox or Spam folder.
            </p>
          </div>
        </div>

        <div className="mt-6 text-gray-500">
          Redirecting to Home in{" "}
          <span className="font-bold text-green-600">{count}</span>{" "}
          second{count !== 1 && "s"}...
        </div>

        <button
          onClick={() =>
            (window.location.href = "https://www.event-booking.live/")
          }
          className="mt-8 w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          Continue Shopping
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}