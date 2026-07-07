import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const OtpInput = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  // ❗ If user directly opens page
  if (!email) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid access. Please login again.
      </p>
    );
  }

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move forward
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle paste (🔥 full OTP paste)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = newOtp.length - 1;
    document.getElementById(`otp-${lastIndex}`).focus();
  };

  // Submit OTP
  const handleSubmit = async () => {
    try {
      const finalOtp = otp.join("");

      if (finalOtp.length < 6) {
        toast.error("Please enter complete OTP");
        return;
      }

      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/v1/user/otpVerification",
        {
          otp: finalOtp,
          email,
        }
      );

      toast.success("OTP verified successfully");

            navigate("/profile", { state: { email: email } });
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Auto submit when full OTP entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-[350px]">
        
        <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>

        <p className="text-gray-500 text-sm mb-2">
          We have sent a 6-digit OTP to your email
        </p>

        <p className="text-blue-600 font-medium mb-4 break-all">
          {email}
        </p>

        <div
          className="flex justify-between gap-2 mb-4"
          onPaste={handlePaste}
        >
          {otp.map((data, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpInput;