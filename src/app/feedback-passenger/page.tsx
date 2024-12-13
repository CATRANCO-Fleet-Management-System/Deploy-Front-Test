"use client";

import React, { useEffect, useState } from "react";
import {
  createFeedbackLog,
  generateOTP,
  verifyPhoneNumber,
} from "../services/feedbackService";
import { getAllVehicles } from "../services/vehicleService";

const FeedbackForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("initial");
  const [busNumber, setBusNumber] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [feedbackLogsId, setFeedbackLogsId] = useState<number | null>(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const busList = await getAllVehicles();
        setBuses(busList);
      } catch (error) {
        alert("Failed to fetch bus list. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // Submit feedback data
  const handleSubmitFeedback = async () => {
    if (!busNumber || rating === 0 || !comments.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const feedbackData = { vehicle_id: busNumber, rating, comments };
      const response = await createFeedbackLog(feedbackData);
      setFeedbackLogsId(response.feedback_logs_id);
      setCurrentStep("phoneInput");
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for phone number verification
  const handlePhoneInputSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
      setLoading(true);
      await generateOTP({ phone_number: phoneNumber, feedback_logs_id: feedbackLogsId });
      setCurrentStep("verification");
    } catch (error) {
      alert("Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the phone number using OTP
  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      alert("Please enter the verification code.");
      return;
    }
    try {
      setLoading(true);
      await verifyPhoneNumber(feedbackLogsId, { phone_number: phoneNumber, otp: verificationCode });
      setCurrentStep("thankYou");
    } catch (error) {
      alert("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the feedback form
  const resetForm = () => {
    setBusNumber("");
    setRating(0);
    setComments("");
    setPhoneNumber("");
    setVerificationCode("");
    setFeedbackLogsId(null);
    setCurrentStep("initial");
  };

  return (
    <section className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-teal-200 to-indigo-300">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        {currentStep === "initial" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Welcome to TransitTrack Feedback</h2>
            <button
              onClick={() => setCurrentStep("feedback")}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send Feedback
            </button>
          </div>
        )}
        {currentStep === "feedback" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
            <select
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select Bus Number</option>
              {buses.map((bus) => (
                <option key={bus.vehicle_id} value={bus.vehicle_id}>
                  {bus.plate_number || `Bus ${bus.vehicle_id}`}
                </option>
              ))}
            </select>
            <div className="mb-4">
              <label className="block mb-2">Rate your experience:</label>
              {[1, 2, 3, 4, 5].map((index) => (
                <span
                  key={index}
                  onClick={() => setRating(index)}
                  className={`text-3xl cursor-pointer ${
                    rating >= index ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your comments..."
              className="w-full mb-4 p-2 border rounded h-20"
            />
            <button
              onClick={handleSubmitFeedback}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}
        {currentStep === "phoneInput" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Phone Number</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter your phone number"
            />
            <button
              onClick={handlePhoneInputSubmit}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Next"}
            </button>
          </div>
        )}
        {currentStep === "verification" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Verify Phone Number</h2>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter the verification code"
            />
            <button
              onClick={handleVerificationSubmit}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}
        {currentStep === "thankYou" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
            <button
              onClick={resetForm}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackForm;
