import { XCircle, RefreshCw, Home } from "lucide-react";

const PaymentFailed = () => {
  const handleRetryPayment = () => {
    window.history.back(); // Go back to payment page
  };

  const handleGoHome = () => {
    window.location.href = "https://www.event-booking.live/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <XCircle
          size={90}
          className="mx-auto text-red-500 animate-pulse"
        />

        {/* Heading */}
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800">
          Payment Failed!
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
          Unfortunately, we couldn't process your payment.
          No amount has been deducted from your account.
        </p>

        {/* Info Box */}
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-left">
          <h3 className="font-semibold text-red-700">
            Possible Reasons
          </h3>

          <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Insufficient account balance.</li>
            <li>Payment was cancelled.</li>
            <li>Network or server issue.</li>
            <li>Your bank declined the transaction.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRetryPayment}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-white font-semibold transition hover:bg-red-700"
          >
            <RefreshCw size={18} />
            Retry Payment
          </button>

          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-gray-700 font-semibold transition hover:bg-gray-100"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If the amount was deducted but you didn't receive a confirmation,
          please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;