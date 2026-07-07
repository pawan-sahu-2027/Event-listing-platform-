
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate(); // Standard casing 'navigate'

  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    name: "",
    email: email || "",
    whatsAppNumber: "",
    role: "user",
    password: "",
    confirmPassword: "",
    image: null,
    preview: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/getUserData",
          { email }
        );

        // Standardized matching for both nested user objects or flat data payloads
        const user = res.data?.user || res.data;

        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || email || "",
            whatsAppNumber: user.whatsAppNumber || "",
            role: user.role || "user",
            preview: user.image || "", // Sets the backend image URL to preview
            image: null, // Keeps the binary file state pristine until user changes it
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      }
    };

    if (email) fetchUser();
  }, [email]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Image upload & preview generation
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file), // Local blob URL for immediate viewing
      }));
    }
  };

  // ✅ Submit profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email); // Ensure backend knows who to update if token isn't used
    data.append("whatsAppNumber", formData.whatsAppNumber); 
    data.append("role", formData.role);

 
    if (formData.password) {
      data.append("password", formData.password);
    }
    if (formData.confirmPassword) {
      data.append("confirmPassword", formData.confirmPassword);
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/v1/user/completeProfile`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");
      navigate(`/login`);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 flex items-center justify-center bg-gray-100">
            {formData.preview ? (
              <img
                src={formData.preview}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium">
                No Image
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3 text-sm text-gray-600 max-w-xs"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Profile</h2>

        {/* Role Toggle */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
          <span className="text-sm font-medium text-gray-700">
            {formData.role === "admin"
              ? "Admin (Can post events)"
              : "User (Can book tickets)"}
          </span>

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                role: prev.role === "user" ? "admin" : "user",
              }))
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              formData.role === "admin" ? "bg-indigo-600" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                formData.role === "admin" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border px-4 py-2 rounded-lg focus:outline-indigo-500"
              required
            />
          </div>

          {/* Email Field (Disabled) */}
          <div>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>

          {/* WhatsApp Field */}
          <div>
            <input
              type="text"
              name="whatsAppNumber"
              value={formData.whatsAppNumber}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="w-full border px-4 py-2 rounded-lg focus:outline-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border px-4 py-2 rounded-lg focus:outline-indigo-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer select-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border px-4 py-2 rounded-lg focus:outline-indigo-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 cursor-pointer select-none"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;