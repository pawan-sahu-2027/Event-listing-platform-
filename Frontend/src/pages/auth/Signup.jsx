// router.post("/signUp", signUp);
// router.post("/otpVerification" , otpVerify);
// router.post("/googleSignUp", googleSignUp);
// router.get("/getUserDataById/:id" ,isAuthenticated ,getUserBYId);
// router.patch("/completeProfile", completeProfile );



// import { auth } from "../firebase";
import {auth} from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import axios from "axios";
// import { toast } from "react-hot-toast";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // 🔥 FORCE account selection
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const googleToken = await result.user.getIdToken(); // ✅ FIX
      const email = result.user.email; // ✅ FIX
      const res = await axios.post(
  "http://localhost:8080/api/v1/user/googleSignUp",
  { googleToken }
);
      toast.success("Signed up successfully");
      navigate("/profile" ,{ state: { email: email } });
    } catch (error) {
      console.log("ERROR:", error.code);
      console.log("MESSAGE:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/v1/user/signUp", formData);

      toast.success("Account created successfully");
        console.log("response data ",res.data);
    //   navigate(`/profile/${res.data.user._id}`);
     toast.success("OTP sent to your email");
        navigate("/otp-verification", { state: { email: formData.email } });
        
        
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left */}
        <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-10">
          <div>
            <h2 className="text-3xl font-bold mb-3">Join Us 🚀</h2>
            <p className="text-sm opacity-90">
              Create and manage events easily
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

         

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-red-500 text-white py-2 rounded-lg mt-3"
            >
              Continue with Google
            </button>
          </form>
          <Link to="/login">
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span className="text-indigo-600 cursor-pointer">Login</span>
              </p>
            </Link >
       
        </div>
      </div>
    </div>
  );
};

export default Signup;
