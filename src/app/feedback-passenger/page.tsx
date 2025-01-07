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
  const [buses, setBuses] = useState<any[]>([]);
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
      await generateOTP({
        phone_number: phoneNumber,
        feedback_logs_id: feedbackLogsId,
      });
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
      await verifyPhoneNumber(feedbackLogsId?.toString() || "", {
        phone_number: phoneNumber,
        otp: verificationCode,
      });
      setCurrentStep("thankYou");
    } catch (error) {
      alert("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-teal-100 to-indigo-100">
      <div className="w-full h-full flex flex-col justify-center items-center">
        {currentStep === "initial" && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-5">
              Welcome to TransitTrack Feedback
            </h2>
            <button
              onClick={() => setCurrentStep("feedback")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Feedback
            </button>
          </div>
        )}

        {currentStep === "feedback" && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-5">Give Feedback</h2>
            <div className="mb-5 w-full">
              <label className="block mb-2 text-gray-700">
                Select Bus Number
              </label>
              <select
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Bus Number</option>
                {buses.map((bus) => (
                  <option key={bus.vehicle_id} value={bus.vehicle_id}>
                    {bus.plate_number || `Bus ${bus.vehicle_id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-gray-700">
                How was your experience?
              </label>
              <div className="flex justify-center space-x-2 text-2xl">
                {[1, 2, 3, 4, 5].map((index) => (
                  <span
                    key={index}
                    className={`cursor-pointer ${
                      rating >= index ? "text-yellow-500" : "text-gray-400"
                    }`}
                    onClick={() => setRating(index)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your comments..."
              className="w-full px-4 py-2 mb-5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleSubmitFeedback}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}

        {currentStep === "phoneInput" && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-5">Phone Number</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 mb-5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handlePhoneInputSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Sending OTP..." : "Next"}
            </button>
          </div>
        )}

        {currentStep === "verification" && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-5">Verify Phone Number</h2>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the verification code"
              className="w-full px-4 py-2 mb-5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleVerificationSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {currentStep === "thankYou" && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-5">
              Thank you for your feedback!
            </h2>
            <button
              onClick={() => setCurrentStep("initial")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
