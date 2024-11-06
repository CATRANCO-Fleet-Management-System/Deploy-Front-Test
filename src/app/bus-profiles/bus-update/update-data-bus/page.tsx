"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
<<<<<<< HEAD
import { getVehicleById, updateVehicle } from "@/app/services/vehicleService"; // Adjust the import path based on your project structure

const BusUpdate = ({ vehicle_id }) => { // Assuming vehicleId is passed as a prop or from the router
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  // State for each bus detail
  const [busDetails, setBusDetails] = useState({
    bus_number: '',
    official_receipt_registration: '',
    certificate_of_registration: '',
    plate_number: '',
    engine_number: '',
    chasis_number: '',
    third_party_liability_insurance: '',
    third_party_liability_insurance_policy_no: '',
    comprehensive_insurance: '',
    supplier: ''
  });

  // State for validity dates
  const [TPLValidity, setTPLValidity] = useState(new Date());
  const [CIValidity, setCIValidity] = useState(new Date());
  const [DatePurchased, setDatePurchased] = useState(new Date()); // State for DatePurchased

  // Fetch vehicle details when component mounts
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const data = await getVehicleById(vehicle_id); // Fetch vehicle details
        setBusDetails(data); // Update state with fetched details
        setTPLValidity(new Date(data.third_party_liability_insurance_validity));
        setCIValidity(new Date(data.comprehensive_insurance_validity));
        setDatePurchased(new Date(data.date_purchased)); // Initialize DatePurchased
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicleDetails();
  }, [vehicle_id]);
=======

const BusUpdate = () => {
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

  // Generate bus numbers
  const busOptions = Array.from(
    { length: 11 },
    (_, i) => `BUS ${String(i + 1).padStart(3, "0")}`
  );
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f

  // Function to handle the cancel button click
  const handleCancelClick = () => {
    router.push("/bus-profiles"); // Redirect to bus-profiles on cancel
  };

<<<<<<< HEAD
  // Function to handle the update
  const handleUpdate = async () => {
    try {
      await updateVehicle(vehicle_id, { 
        ...busDetails, 
        third_party_liability_insurance_validity: TPLValidity.toISOString().split("T")[0], // Format date
        comprehensive_insurance_validity: CIValidity.toISOString().split("T")[0], // Format date
        date_purchased: DatePurchased.toISOString().split("T")[0] // Format date
      });
      router.push("/bus-profiles"); // Redirect to bus-profiles after successful update
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
=======
  // Function to handle the next button click
  const handleNextClick = () => {
    router.push("/bus-profiles/bus-update/update-personnel"); // Redirect to assign personnel on next
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Update Bus Record" />

        <section className="right w-full overflow-y-hidden">
          <div className="forms-container ml-14">
            <div className="output flex flex-row space-x-2 mt-20">
<<<<<<< HEAD
              <div className="forms flex w-11/12 bg-white h-auto rounded-lg border border-gray-300">
=======
              <div className="forms flex w-11/12 bg-white h-140 rounded-lg border-1 border-gray-300">
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                <div className="1st-row flex-col m-5 ml-14 w-96 space-y-4 mt-10">
                  <h1>Bus Number</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Bus Number"
<<<<<<< HEAD
                    value={busDetails.bus_number}
                    onChange={(e) => setBusDetails({ ...busDetails, bus_number: e.target.value })}
=======
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                  />
                  <h1>Official Receipt of Registration</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="OR #"
<<<<<<< HEAD
                    value={busDetails.official_receipt_registration}
                    onChange={(e) => setBusDetails({ ...busDetails, official_receipt_registration: e.target.value })}
=======
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                  />
                  <h1>Certificate of Registration</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="CR #"
<<<<<<< HEAD
                    value={busDetails.certificate_of_registration}
                    onChange={(e) => setBusDetails({ ...busDetails, certificate_of_registration: e.target.value })}
                  />
                  <h1>Plate Number</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="#"
                    value={busDetails.plate_number}
                    onChange={(e) => setBusDetails({ ...busDetails, plate_number: e.target.value })}
                  />
                  <h1>Engine Number</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="#"
                    value={busDetails.engine_number}
                    onChange={(e) => setBusDetails({ ...busDetails, engine_number: e.target.value })}
                  />
                  <h1>Chasis Number</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="#"
                    value={busDetails.chasis_number}
                    onChange={(e) => setBusDetails({ ...busDetails, chasis_number: e.target.value })}
                  />
                </div>
                <div className="2nd-row flex-col m-5 w-96 space-y-4 mt-10">
                  <h1>3rd Party Liability Insurance</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="#"
                    value={busDetails.third_party_liability_insurance}
                    onChange={(e) => setBusDetails({ ...busDetails, third_party_liability_insurance: e.target.value })}
                  />
                  <h1>3rd Party Liability Insurance Policy No.</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder=""
                    value={busDetails.third_party_liability_insurance_policy_no}
                    onChange={(e) => setBusDetails({ ...busDetails, third_party_liability_insurance_policy_no: e.target.value })}
                  />
=======
                  />
                  <h1>Plate Number</h1>
                  <Input className="h-10 text-lg" type="text" placeholder="#" />
                  <h1>Engine Number</h1>
                  <Input className="h-10 text-lg" type="text" placeholder="#" />
                  <h1>Chasis Number</h1>
                  <Input className="h-10 text-lg" type="text" placeholder="#" />
                </div>
                <div className="2nd-row flex-col m-5 w-96 space-y-4 mt-10">
                  <h1>3rd Party Liability Insurance</h1>
                  <Input className="h-10 text-lg" type="text" placeholder="#" />
                  <h1>3rd Party Liability Insurance Policy No.</h1>
                  <Input className="h-10 text-lg" type="text" placeholder="" />
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                  <h1>3rd Party Liability Insurance Validity</h1>
                  <DatePicker
                    id="TPLValidity"
                    selected={TPLValidity}
                    onChange={(date) => setTPLValidity(date)} // Handle date change
                    className="border border-gray-500 p-3 rounded-md w-full mt-1"
                    dateFormat="MM/dd/yyyy"
                  />
                  <h1>Comprehensive Insurance</h1>
<<<<<<< HEAD
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder=""
                    value={busDetails.comprehensive_insurance}
                    onChange={(e) => setBusDetails({ ...busDetails, comprehensive_insurance: e.target.value })}
                  />
                  <h1>Comprehensive Insurance Validity</h1>
=======
                  <Input className="h-10 text-lg" type="text" placeholder="" />
                  <h1>Comprehensive Insurance Validity.</h1>
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                  <DatePicker
                    id="CIValidity"
                    selected={CIValidity}
                    onChange={(date) => setCIValidity(date)} // Handle date change
                    className="border border-gray-500 p-3 rounded-md w-full mt-1"
                    dateFormat="MM/dd/yyyy"
                  />
                </div>
                <div className="3rd-row ml-14 mt-10">
                  <h1>Date Purchased</h1>
                  <DatePicker
                    id="DatePurchased"
<<<<<<< HEAD
                    selected={DatePurchased} // Use defined state variable
=======
                    selected={DatePurchased}
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                    onChange={(date) => setDatePurchased(date)} // Handle date change
                    className="border border-gray-500 p-3 rounded-md w-full mt-1"
                    dateFormat="MM/dd/yyyy"
                  />
                  <h1 className="mb-4 mt-4">Supplier</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Partner Name"
<<<<<<< HEAD
                    value={busDetails.supplier}
                    onChange={(e) => setBusDetails({ ...busDetails, supplier: e.target.value })}
=======
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                  />
                </div>
                <div className="relative">
                  <div className="buttons absolute bottom-0 right-0 flex flex-col space-y-5 w-24 mb-8 mr-8">
                    <button
<<<<<<< HEAD
                      onClick={handleUpdate} // Call handleUpdate on Update button
                      className="flex items-center justify-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCancelClick} // Call handleCancelClick on Cancel button
                      className="flex items-center justify-center px-4 py-2 border-2 border-red-500 rounded-md text-red-500 transition-colors duration-300 ease-in-out hover:bg-red-50"
=======
                      onClick={handleNextClick} // Call handleNextClick on Next button
                      className="flex items-center justify-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={handleCancelClick} // Call handleCancelClick on Cancel button
                      className="flex items-center justify-center px-4 py-2 border-2 border-red-500 rounded-md text-red-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
>>>>>>> 8d751dc8934f66c89608192fabadfa7720e00d4f
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default BusUpdate;
