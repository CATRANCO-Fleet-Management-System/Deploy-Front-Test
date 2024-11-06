"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

  // Function to handle the cancel button click
  const handleCancelClick = () => {
    router.push("/bus-profiles"); // Redirect to bus-profiles on cancel
  };

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
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Update Bus Record" />

        <section className="right w-full overflow-y-hidden">
          <div className="forms-container ml-14">
            <div className="output flex flex-row space-x-2 mt-20">
              <div className="forms flex w-11/12 bg-white h-auto rounded-lg border border-gray-300">
                <div className="1st-row flex-col m-5 ml-14 w-96 space-y-4 mt-10">
                  <h1>Bus Number</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Bus Number"
                    value={busDetails.bus_number}
                    onChange={(e) => setBusDetails({ ...busDetails, bus_number: e.target.value })}
                  />
                  <h1>Official Receipt of Registration</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="OR #"
                    value={busDetails.official_receipt_registration}
                    onChange={(e) => setBusDetails({ ...busDetails, official_receipt_registration: e.target.value })}
                  />
                  <h1>Certificate of Registration</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="CR #"
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
                  <h1>3rd Party Liability Insurance Validity</h1>
                  <DatePicker
                    id="TPLValidity"
                    selected={TPLValidity}
                    onChange={(date) => setTPLValidity(date)} // Handle date change
                    className="border border-gray-500 p-3 rounded-md w-full mt-1"
                    dateFormat="MM/dd/yyyy"
                  />
                  <h1>Comprehensive Insurance</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder=""
                    value={busDetails.comprehensive_insurance}
                    onChange={(e) => setBusDetails({ ...busDetails, comprehensive_insurance: e.target.value })}
                  />
                  <h1>Comprehensive Insurance Validity</h1>
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
                    selected={DatePurchased} // Use defined state variable
                    onChange={(date) => setDatePurchased(date)} // Handle date change
                    className="border border-gray-500 p-3 rounded-md w-full mt-1"
                    dateFormat="MM/dd/yyyy"
                  />
                  <h1 className="mb-4 mt-4">Supplier</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    placeholder="Partner Name"
                    value={busDetails.supplier}
                    onChange={(e) => setBusDetails({ ...busDetails, supplier: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <div className="buttons absolute bottom-0 right-0 flex flex-col space-y-5 w-24 mb-8 mr-8">
                    <button
                      onClick={handleUpdate} // Call handleUpdate on Update button
                      className="flex items-center justify-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCancelClick} // Call handleCancelClick on Cancel button
                      className="flex items-center justify-center px-4 py-2 border-2 border-red-500 rounded-md text-red-500 transition-colors duration-300 ease-in-out hover:bg-red-50"
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
