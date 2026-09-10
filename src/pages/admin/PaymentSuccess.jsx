import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("eventDraft");

    toast.success("Payment Successful");

    const timer = setTimeout(() => {
      navigate("/admin/add-event");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl p-10 text-center">
        <div className="text-6xl">✅</div>

        <h1 className="text-3xl font-bold mt-5">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-3">
          Your event has been created successfully.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;