import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const API_URL = "https://z80x8c7mx3.execute-api.ap-south-1.amazonaws.com";
  const [userDetails, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending request to:", `${API_URL}/api/v1/user/login`);
// console.log(userDetails);
console.log("Sending:", userDetails);


      const res = await axios.post(`${API_URL}/api/v1/user/login`, userDetails);
      localStorage.setItem("AccessToken", res.data.AccessToken);
      toast.success("Login successful");
    //   
      navigate("/" );
    } catch (error) {
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);
  console.log(error);
}
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left */}
        <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-10">
          <div>
            <h2 className="text-3xl font-bold mb-3">Welcome Back 👋</h2>
            <p className="text-sm opacity-90">Login to manage your events</p>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              name="password"
              value={userDetails.password}
              onChange={handleChange}
            />

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Login
            </button>

            <div className="absolute top-4 right-4 text-sm t">
              Don't have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer hover:underline"
                onClick={() => navigate("/signUp")}
              >
                Register
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
