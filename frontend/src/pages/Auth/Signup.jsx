import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

  const [previewPic, setPreviewPic] = useState(null);
  const { signup } = useAuthStore(); // store method to call API
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files && files[0]) {
      setPreviewPic(URL.createObjectURL(files[0]));
      setFormData((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await signup(formData); // call store method
      navigate("/write-review/:id"); // redirect after signup
    } catch (err) {
      console.error(err);
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 m-10 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">CineVerse</h1>
            <h2 className="text-2xl font-bold text-white mt-4">
              Create your account
            </h2>
            <p className="text-gray-400 mb-6">Join our community of movie lovers.</p>

            {/* Circular Avatar */}
            <label
              htmlFor="profilePicInput"
              className="cursor-pointer inline-block mb-6"
            >
              <div className="w-40 h-40 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center mx-auto">
                <img
                  src={previewPic || "/avatar.png"} // default avatar if no image uploaded
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                id="profilePicInput"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-md w-full p-2.5"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 text-white rounded-md w-full p-2.5"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-white rounded-md w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-white rounded-md w-full p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-3 focus:ring-blue-600"
              />
              <label className="ml-3 text-sm text-gray-400">
                I accept the{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-md px-5 py-2.5"
            >
              Create Account
            </button>

            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
