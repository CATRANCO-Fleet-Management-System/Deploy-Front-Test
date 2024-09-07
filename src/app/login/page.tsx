"use client"; // Ensure this file is treated as a client-side component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, register } from "../services/authService"; // Import auth service

export default function LoginPage() {
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    key: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const router = useRouter(); // Initialize useRouter from next/navigation

  const toggleRegister = () => {
    setRegisterVisible(!isRegisterVisible);
    // Clear form errors and data when toggling
    setFormErrors({});
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      key: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleLogin = async () => {
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true); // Start loading state

    try {
      const response = await login({
        email: formData.username, // Assuming username is the email
        password: formData.password,
      });
      console.log("Login successful", response);

      // After successful login, redirect to the dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setFormErrors({
        global: "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false); // End loading state
    }
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.key) errors.key = "Key is required";
    return errors;
  };

  const handleRegister = async () => {
    const errors = validateRegisterForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true); // Start loading state

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        key: formData.key,
      });
      console.log("Registration successful", response);

      // Optionally redirect to login or another page
      setRegisterVisible(false);
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        key: "",
      });
    } catch (error) {
      console.error("Registration failed", error);
      setFormErrors({
        global: "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <div className="left w-1/2 h-full flex justify-center items-center">
        <img
          src="/logo.png"
          alt="Image Logo"
          className="w-4/5 object-contain ml-20"
        />
      </div>
      <div className="right w-1/2 h-full flex ml-10 items-center">
        <div className="form-container h-3/4 w-4/5 bg-slate-200 rounded-xl shadow-lg shadow-cyan-500/50 flex flex-col items-center">
          <div className="forms space-y-10 w-4/5 mt-24">
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
          <div className="btn-container mt-12 w-full flex flex-col items-center space-y-10">
            <Button
              className="h-16 w-4/5 text-white text-2xl font-bold bg-gradient-to-r from-blue-500 to-red-500"
              onClick={handleLogin}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              onClick={toggleRegister}
              className="h-16 w-4/5 text-blue-500 text-2xl font-bold bg-white border border-blue-500 rounded-lg"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

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
              <Input
                className="h-12 text-lg"
                type="text"
                placeholder="Firstname"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {formErrors.firstName && (
                <p className="text-red-500">{formErrors.firstName}</p>
              )}
              <Input
                className="h-12 text-lg"
                type="text"
                placeholder="Lastname"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {formErrors.lastName && (
                <p className="text-red-500">{formErrors.lastName}</p>
              )}
              <Input
                className="h-12 text-lg"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500">{formErrors.email}</p>
              )}
              <Input
                className="h-12 text-lg"
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
                className="h-12 text-lg"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-500">{formErrors.password}</p>
              )}
              <Input
                className="h-12 text-lg"
                type="password"
                placeholder="Re-type Password"
              />
              <Input
                className="h-12 text-lg"
                type="text"
                placeholder="Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
              />
              {formErrors.key && (
                <p className="text-red-500">{formErrors.key}</p>
              )}
            </div>
            <Button
              className="mt-8 h-12 w-full text-white text-xl font-bold bg-gradient-to-r from-blue-500 to-red-500"
              onClick={handleRegister}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Registering..." : "Create Account"}
            </Button>
            <Button
              onClick={toggleRegister}
              className="mt-4 h-12 w-full text-blue-500 text-xl font-bold bg-white border border-blue-500 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
