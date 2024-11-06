"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicles } from "@/app/services/vehicleService"; // Import your vehicle service
import { createVehicleAssignment } from "@/app/services/vehicleAssignService";

const BusAdd = () => {
  const [drivers, setDrivers] = useState([]);
  const [paos, setPaos] = useState([]);
  const [vehicles, setVehicles] = useState([]); // State for vehicles
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedPAO, setSelectedPAO] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(""); // State for selected vehicle
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const router = useRouter();

  // Fetch drivers, PAOs, and vehicles on component mount
  useEffect(() => {
    const fetchProfilesAndVehicles = async () => {
      setLoading(true); // Set loading to true
      try {
        const profiles = await getAllProfiles();
        const driverProfiles = profiles.filter(profile => profile.profile.position === 'driver');
        const paoProfiles = profiles.filter(profile => profile.profile.position === 'passenger_assistant_officer');
        const vehicleData = await getAllVehicles(); // Fetch vehicles

        setDrivers(driverProfiles);
        setPaos(paoProfiles);
        setVehicles(vehicleData); // Set vehicles state
      } catch (error) {
        setError("Error fetching profiles or vehicles."); // Set error message
        console.error("Error fetching profiles or vehicles:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchProfilesAndVehicles();
=======
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BusAdd = () => {
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
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
  }, []);

  // Function to handle the cancel button click
  const handleCancelClick = () => {
    router.push("/bus-profiles");
  };

<<<<<<< HEAD
  // Function to handle the done button click
  const handleDoneClick = async () => {
    if (!selectedDriver || !selectedPAO || !selectedVehicle) {
      setError("Please select a driver, PAO, and vehicle."); // Validate selection
      return;
    }

    setLoading(true); // Set loading to true
    try {
      const assignmentData = {
        vehicle_id: selectedVehicle, // Added vehicle_id
        user_profile_ids: [selectedDriver, selectedPAO], // Changed to user_profile_ids
      };

      await createVehicleAssignment(assignmentData); // Call API to create assignment
      console.log("Vehicle assignment created:", assignmentData);
      router.push("/bus-profiles");
    } catch (error) {
      setError("Error creating vehicle assignment."); // Set error message
      console.error("Error creating vehicle assignment:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

=======
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Personnel Assignment" />

        <section className="right w-full flex justify-center items-center">
          <div className="forms-container">
<<<<<<< HEAD
            <div className="forms flex flex-col items-center w-[500px] bg-white min-h-[500px] rounded-lg border border-gray-300 p-8 space-y-6 mt-20">
              <h1 className="text-xl mt-10">Driver Assignment</h1>
              {loading ? (
                <p>Loading drivers...</p>
              ) : (
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Select a Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.profile.user_profile_id} value={driver.profile.user_profile_id}>
                      {`${driver.profile.first_name} ${driver.profile.last_name}`}
                    </option>
                  ))}
                </select>
              )}

              <h1 className="text-xl mt-4">Passenger Officer Assistant Assignment</h1>
              {loading ? (
                <p>Loading PAOs...</p>
              ) : (
                <select
                  value={selectedPAO}
                  onChange={(e) => setSelectedPAO(e.target.value)}
                  className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Select a PAO</option>
                  {paos.map((pao) => (
                    <option key={pao.profile.user_profile_id} value={pao.profile.user_profile_id}>
                      {`${pao.profile.first_name} ${pao.profile.last_name}`}
                    </option>
                  ))}
                </select>
              )}

              <h1 className="text-xl mt-4">Select Vehicle</h1>
              {loading ? (
                <p>Loading vehicles...</p>
              ) : (
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Select a Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                      {`${vehicle.vehicle_id}`} {/* Adjust according to your vehicle object structure */}
                    </option>
                  ))}
                </select>
              )}

              {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

              <div className="buttons mt-6">
                <div className="buttons flex justify-center space-x-4 w-full mt-6">
                  <button
                    onClick={handleDoneClick}
                    className="px-4 py-2 w-24 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    disabled={loading} // Disable while loading
                  >
=======
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
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
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

export default BusAdd;
