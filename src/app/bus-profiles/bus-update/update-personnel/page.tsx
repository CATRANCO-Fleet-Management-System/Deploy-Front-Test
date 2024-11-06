"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdatePersonnel = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [TPLValidity, setTPLValidity] = useState(new Date());
  const [CIValidity, setCIValidity] = useState(new Date());
  const [DatePurchased, setDatePurchased] = useState(new Date());

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to handle the cancel button click
  const handleCancelClick = () => {
    router.push("/bus-profiles");
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Update Personnel Assignment" />

        <section className="right w-full flex justify-center items-center">
          <div className="forms-container">
            <div className="forms flex flex-col  items-center w-[500px] bg-white min-h-[500px] rounded-lg border border-gray-300 p-8 space-y-6 mt-20">
              <h1 className="text-xl mt-10">Driver Assignment</h1>
              <select className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full">
                <option value="">Select a Driver</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`Driver ${i + 1}`}>
                    {`Driver name ${i + 1}`}
                  </option>
                ))}
              </select>

              <h1 className="text-xl mt-4">
                Passenger Officer Assistant Assignment
              </h1>
              <select className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full">
                <option value="">Select a PAO</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`PAO ${i + 1}`}>
                    {`PAO name ${i + 1}`}
                  </option>
                ))}
              </select>
              <div className="buttons mt-6">
                <div className="buttons flex justify-center space-x-4 w-full mt-6">
                  <button className="px-4 py-2 w-24 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
                    Done
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 w-24 border-2 border-red-500 rounded-md text-red-500 transition-colors duration-300 ease-in-out hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

<<<<<<< HEAD
export default UpdatePersonnel;
=======
export default UpdatePersonnel;
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
