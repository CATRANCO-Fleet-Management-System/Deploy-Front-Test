"use client"; // Ensure this file is treated as a client-side component

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, register } from "../services/authService";

export default function AuthPage() {
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    position: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle the register form visibility
  const toggleRegister = () => {
    setRegisterVisible(!isRegisterVisible);
    setFormErrors({});
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      position: "",
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  // Handle login form submission
  const handleLogin = async () => {
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
      });

      if (response?.message === "User is already logged in") {
        setFormErrors({ global: "User is already logged in. Redirecting..." });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else if (response?.token) {
        router.push("/dashboard");
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      setFormErrors({
        global: error.message || "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate register form
  const validateRegisterForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.position) errors.position = "Position is required";
    return errors;
  };

  // Handle register form submission
  const handleRegister = async () => {
    const errors = validateRegisterForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        position: formData.position,
      });

      setRegisterVisible(false);
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        position: "",
      });
    } catch (error) {
      setFormErrors({
        global:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      {/* Left Side - Logo */}
      <div className="left w-1/2 h-full flex justify-center items-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-4/5 object-contain ml-20"
        />
      </div>

      {/* Right Side - Form */}
      <div className="right w-1/2 h-full flex ml-10 items-center">
        <div className="form-container h-3/4 w-4/5 bg-slate-200 rounded-xl shadow-lg shadow-cyan-500/50 flex flex-col items-center">
          <div className="forms space-y-10 w-4/5 mt-24">
            {/* Login Form Fields */}
            <Input
              className="h-16 text-lg"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p className="text-red-500">{formErrors.username}</p>
            )}
            <Input
              className="h-16 text-lg"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="text-red-500">{formErrors.password}</p>
            )}
            {formErrors.global && (
              <p className="text-red-500">{formErrors.global}</p>
            )}
          </div>

          {/* Login Button */}
          <div className="btn-container mt-12 w-full flex flex-col items-center space-y-10">
            <Button
              className="h-16 w-4/5 text-white text-2xl font-bold bg-gradient-to-r from-blue-500 to-red-500"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {/* <Button
              className="h-16 w-4/5 text-white text-2xl font-bold bg-gradient-to-r from-green-500 to-yellow-500"
              onClick={toggleRegister}
            >
              Register
            </Button> */}
          </div>
        </div>
      </div>

      {/* Register Form Modal */}
      {isRegisterVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative bg-white p-10 rounded-xl shadow-lg w-1/3">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={toggleRegister}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center">Register</h2>
            <div className="space-y-6">
              {/* Register Form Fields */}
              {[
                "firstName",
                "lastName",
                "email",
                "username",
                "password",
                "confirmPassword",
                "position",
              ].map((field) => (
                <div key={field}>
                  <Input
                    className="h-12 text-lg"
                    type={field.includes("password") ? "password" : "text"}
                    placeholder={
                      field.charAt(0).toUpperCase() +
                      field
                        .slice(1)
                        .replace("confirmPassword", "Re-type Password")
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {formErrors[field] && (
                    <p className="text-red-500">{formErrors[field]}</p>
                  )}
                </div>
              ))}
            </div>
            {formErrors.global && (
              <p className="text-red-500 mt-4">{formErrors.global}</p>
            )}
            {/* <div className="flex justify-center mt-10">
              <Button
                className="h-12 w-full text-white text-xl font-bold bg-gradient-to-r from-blue-500 to-red-500"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </section>
  );
}
