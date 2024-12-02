"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AssignBusPersonnelModal from "../components/AssignBusPersonnelModal";
import { createVehicle } from "../services/vehicleService";  // Import the service

const AddBusRecordModal = ({ onClose }) => {
  const [busNumber, setBusNumber] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [officialReceipt, setOfficialReceipt] = useState("");
  const [certificateOfRegistration, setCertificateOfRegistration] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [chasisNumber, setChasisNumber] = useState("");
  const [thirdPartyInsurance, setThirdPartyInsurance] = useState("");
  const [thirdPartyPolicyNo, setThirdPartyPolicyNo] = useState("");
  const [thirdPartyValidity, setThirdPartyValidity] = useState(new Date());
  const [comprehensiveInsurance, setComprehensiveInsurance] = useState("");
  const [comprehensiveValidity, setComprehensiveValidity] = useState(new Date());
  const [datePurchased, setDatePurchased] = useState(new Date());
  const [supplier, setSupplier] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state

  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      vehicle_id: busNumber,
      plate_number: plateNumber,
      or_id: officialReceipt,
      cr_id: certificateOfRegistration,
      engine_number: engineNumber,
      chasis_number: chasisNumber,
      third_pli: thirdPartyInsurance,
      third_pli_policy_no: thirdPartyPolicyNo,
      third_pli_validity: formatDate(thirdPartyValidity),
      ci: comprehensiveInsurance,
      ci_validity: formatDate(comprehensiveValidity),
      date_purchased: formatDate(datePurchased),
      supplier: supplier,
    };

    try {
      // Send the vehicle data to the backend
      await createVehicle(vehicleData);
      setIsSubmitted(true); // Set submitted to true on successful submission
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Debugging: Check submission state and whether modal should render
  if (isSubmitted) {
    return <AssignBusPersonnelModal onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold">Add Bus Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bus Number</label>
            <input
              type="text"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Bus Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Official Receipt of Registration</label>
            <input
              type="text"
              value={officialReceipt}
              onChange={(e) => setOfficialReceipt(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="OR #"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Certificate of Registration</label>
            <input
              type="text"
              value={certificateOfRegistration}
              onChange={(e) => setCertificateOfRegistration(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="CR #"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Plate Number</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Plate Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Engine Number</label>
            <input
              type="text"
              value={engineNumber}
              onChange={(e) => setEngineNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Engine Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chasis Number</label>
            <input
              type="text"
              value={chasisNumber}
              onChange={(e) => setChasisNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Chasis Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">3rd Party Liability Insurance</label>
            <input
              type="text"
              value={thirdPartyInsurance}
              onChange={(e) => setThirdPartyInsurance(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="3rd Party Liability Insurance"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">3rd Party Liability Insurance Policy No.</label>
            <input
              type="text"
              value={thirdPartyPolicyNo}
              onChange={(e) => setThirdPartyPolicyNo(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Policy No."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">3rd Party Liability Insurance Validity</label>
            <DatePicker
              selected={thirdPartyValidity}
              onChange={(date) => setThirdPartyValidity(date)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comprehensive Insurance</label>
            <input
              type="text"
              value={comprehensiveInsurance}
              onChange={(e) => setComprehensiveInsurance(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Comprehensive Insurance"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comprehensive Insurance Validity</label>
            <DatePicker
              selected={comprehensiveValidity}
              onChange={(date) => setComprehensiveValidity(date)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Purchased</label>
            <DatePicker
              selected={datePurchased}
              onChange={(date) => setDatePurchased(date)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Supplier"
            />
          </div>

          <div className="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusRecordModal;
