"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getVehicleById, updateVehicle } from "@/app/services/vehicleService";

interface EditBusRecordModalProps {
  vehicle_id: string;
  onClose: () => void;
  onUpdate: () => void;
}

const EditBusRecordModal: React.FC<EditBusRecordModalProps> = ({
  vehicle_id,
  onClose,
  onUpdate,
}) => {
  const [busDetails, setBusDetails] = useState({
    vehicle_id: "",
    or_id: "",
    cr_id: "",
    plate_number: "",
    engine_number: "",
    chasis_number: "",
    third_pli: "",
    third_pli_policy_no: "",
    ci: "",
    supplier: "",
  });

  // State for validity dates
  const [third_pli_validity, setTPLValidity] = useState<Date | null>(null);
  const [ci_validity, setCIValidity] = useState<Date | null>(null);
  const [date_purchased, setDatePurchased] = useState<Date | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vehicle details on mount
  useEffect(() => {
    if (!vehicle_id) {
      setError("Vehicle ID is missing.");
      return;
    }

    const fetchVehicleDetails = async () => {
      try {
        const data = await getVehicleById(vehicle_id);
        setBusDetails({
          vehicle_id: data.vehicle_id || "",
          or_id: data.or_id || "",
          cr_id: data.cr_id || "",
          plate_number: data.plate_number || "",
          engine_number: data.engine_number || "",
          chasis_number: data.chasis_number || "",
          third_pli: data.third_pli || "",
          third_pli_policy_no: data.third_pli_policy_no || "",
          ci: data.ci || "",
          supplier: data.supplier || "",
        });
        setTPLValidity(data.third_pli_validity ? new Date(data.third_pli_validity) : null);
        setCIValidity(data.ci_validity ? new Date(data.ci_validity) : null);
        setDatePurchased(data.date_purchased ? new Date(data.date_purchased) : null);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicle_id]);

  // Update handler
  const handleUpdate = async () => {
    try {
      // Ensure that vehicle_id is included in the payload
      const updatedData = {
        vehicle_id: busDetails.vehicle_id, // Make sure vehicle_id is included here
        or_id: busDetails.or_id,
        cr_id: busDetails.cr_id,
        plate_number: busDetails.plate_number,
        engine_number: busDetails.engine_number,
        chasis_number: busDetails.chasis_number,
        third_pli: busDetails.third_pli,
        third_pli_policy_no: busDetails.third_pli_policy_no,
        ci: busDetails.ci,
        supplier: busDetails.supplier,
        third_pli_validity: third_pli_validity
          ? third_pli_validity.toISOString().split("T")[0]
          : null,
        ci_validity: ci_validity ? ci_validity.toISOString().split("T")[0] : null,
        date_purchased: date_purchased
          ? date_purchased.toISOString().split("T")[0]
          : null,
      };
  
      // Log the data to check if vehicle_id is passed
      console.log("Updated Data:", updatedData);
  
      // Call the update API
      await updateVehicle(vehicle_id, updatedData);
      alert("Bus record updated successfully!");
      onUpdate(); // Trigger parent update after success
      onClose(); // Close the modal after update
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setError("Failed to update vehicle. Please try again.");
    }
  };
  

  // Cancel handler
  const handleCancelClick = () => {
    onClose();
  };

  if (loading) {
    return <div>Loading vehicle details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl sm:max-w-xl md:max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Bus Record</h2>

        {/* Vehicle ID */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Vehicle ID</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="Vehicle ID"
            value={busDetails.vehicle_id}
            onChange={(e) =>
              setBusDetails({ ...busDetails, vehicle_id: e.target.value })
            }
            disabled
          />
        </div>

        {/* OR Number */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">OR Number</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="OR #"
            value={busDetails.or_id}
            onChange={(e) =>
              setBusDetails({ ...busDetails, or_id: e.target.value })
            }
          />
        </div>

        {/* CR Number */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">CR Number</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="CR #"
            value={busDetails.cr_id}
            onChange={(e) =>
              setBusDetails({ ...busDetails, cr_id: e.target.value })
            }
          />
        </div>

        {/* Plate Number */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Plate Number</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="Plate Number"
            value={busDetails.plate_number}
            onChange={(e) =>
              setBusDetails({ ...busDetails, plate_number: e.target.value })
            }
            disabled
          />
        </div>

        {/* Third Party Liability Insurance */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Third Party Liability Insurance</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="Third Party Insurance"
            value={busDetails.third_pli}
            onChange={(e) =>
              setBusDetails({ ...busDetails, third_pli: e.target.value })
            }
          />
        </div>

        {/* Third Party Liability Policy Number */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Third Party Liability Policy Number</h1>
          <Input
            className="h-12 text-lg border-gray-300 border rounded-lg shadow-sm px-4 py-2 w-full mt-2"
            type="text"
            placeholder="Policy Number"
            value={busDetails.third_pli_policy_no}
            onChange={(e) =>
              setBusDetails({
                ...busDetails,
                third_pli_policy_no: e.target.value,
              })
            }
          />
        </div>

        {/* Date Pickers */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Third Party Liability Validity</h1>
          <DatePicker
            selected={third_pli_validity}
            onChange={(date) => setTPLValidity(date)}
            className="border border-gray-300 p-4 rounded-lg shadow-sm w-full mt-2"
            dateFormat="MM/dd/yyyy"
          />
        </div>

        {/* Other Date Pickers and Fields */}
        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Comprehensive Insurance Validity</h1>
          <DatePicker
            selected={ci_validity}
            onChange={(date) => setCIValidity(date)}
            className="border border-gray-300 p-4 rounded-lg shadow-sm w-full mt-2"
            dateFormat="MM/dd/yyyy"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-sm font-medium text-gray-600">Date Purchased</h1>
          <DatePicker
           
           selected={date_purchased}
           onChange={(date) => setDatePurchased(date)}
           className="border border-gray-300 p-4 rounded-lg shadow-sm w-full mt-2"
           dateFormat="MM/dd/yyyy"
         />
       </div>

       {/* Action Buttons */}
       <div className="flex justify-end mt-8">
         <button
           onClick={handleCancelClick}
           className="mr-4 py-2 px-6 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
         >
           Cancel
         </button>
         <button
           onClick={handleUpdate}
           className="py-2 px-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
         >
           Update
         </button>
       </div>
     </div>
   </div>
 );
};

export default EditBusRecordModal;
