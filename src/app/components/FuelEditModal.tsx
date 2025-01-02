import React, { useState, useEffect, useRef } from "react";
import { FaBus } from "react-icons/fa";
import { updateFuelLog } from "@/app/services/fuellogsService";

const FuelEditModal = ({
  selectedBus,
  selectedFuelLog,
  onClose = () => {},
  onUpdate = () => {},
}) => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    distanceTraveled: "",
    fuelType: "",
    fuelPrice: "",
    fuel_liters_quantity: "",
    total_expense: "",
    odometerProof: null,
    fuelReceiptProof: null,
  });

  useEffect(() => {
    if (selectedFuelLog && selectedBus) {
      if (selectedFuelLog.fuel_logs_id) {
        setFormData({
          date: selectedFuelLog.purchase_date?.split(" ")[0] || "",
          distanceTraveled: selectedFuelLog.odometer_km || "",
          fuelType: selectedFuelLog.fuel_type || "",
          fuelPrice: selectedFuelLog.fuel_price?.replace(/[^0-9.]/g, "") || "",
          fuel_liters_quantity: selectedFuelLog.fuel_liters_quantity || "",
          total_expense:
            selectedFuelLog.total_expense?.replace(/[^0-9.]/g, "") || "",
          odometerProof: null,
          fuelReceiptProof: null,
        });
      }
    }
  }, [selectedFuelLog, selectedBus]);

  useEffect(() => {
    if (formData.fuelPrice && formData.fuel_liters_quantity) {
      const price = parseFloat(formData.fuelPrice) || 0;
      const quantity = parseFloat(formData.fuel_liters_quantity) || 0;
      setFormData((prevData) => ({
        ...prevData,
        total_expense: (price * quantity).toFixed(2),
      }));
    }
  }, [formData.fuelPrice, formData.fuel_liters_quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };
  const handleSubmit = async () => {
    if (formRef.current && formRef.current.reportValidity()) {
      setIsSubmitting(true);
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("purchase_date", formData.date);
      formDataToSubmit.append("odometer_km", formData.distanceTraveled);
      formDataToSubmit.append(
        "fuel_liters_quantity",
        formData.fuel_liters_quantity
      );
      formDataToSubmit.append("fuel_price", formData.fuelPrice);
      formDataToSubmit.append("fuel_type", formData.fuelType);
      formDataToSubmit.append("vehicle_id", selectedBus);
      if (formData.odometerProof) {
        formDataToSubmit.append(
          "odometer_distance_proof",
          formData.odometerProof
        );
      }
      if (formData.fuelReceiptProof) {
        formDataToSubmit.append(
          "fuel_receipt_proof",
          formData.fuelReceiptProof
        );
      }

      try {
        const response = await updateFuelLog(
          selectedFuelLog.fuel_logs_id,
          formDataToSubmit
        );
        console.log("Fuel log updated:", response);
        onUpdate(response.fuel_log);
        onClose();
      } catch (error) {
        console.error("Failed to update fuel log:", error);
        alert(
          error?.response?.data?.message ||
            "An error occurred while updating the fuel log. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <div className="flex items-center mb-6">
          <FaBus size={32} className="mr-3" />
          <span className="text-xl font-bold">BUS {selectedBus}</span>
        </div>
        <form ref={formRef} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Section */}
            <div>
              <label className="block font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <label className="block font-medium mt-4">
                Distance Traveled (KM)
              </label>
              <input
                type="number"
                name="distanceTraveled"
                value={formData.distanceTraveled}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <label className="block font-medium mt-4">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="unleaded">Unleaded</option>
                <option value="premium">Premium</option>
                <option value="diesel">Diesel</option>
              </select>
              <label className="block font-medium mt-4">Fuel Price (PHP)</label>
              <input
                type="number"
                name="fuelPrice"
                value={formData.fuelPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <label className="block font-medium mt-4">
                Fuel Quantity (L)
              </label>
              <input
                type="number"
                name="fuel_liters_quantity"
                value={formData.fuel_liters_quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            {/* Right Section */}
            <div>
              <label className="block font-medium">Total Expense (PHP)</label>
              <input
                type="number"
                name="total_expense"
                value={formData.total_expense}
                disabled
                className="w-full border border-gray-300 p-2 rounded"
              />
              <label className="block font-medium mt-4">
                Distance (Odometer) Proof
              </label>
              <input
                type="file"
                name="odometerProof"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
                accept="image/*"
              />
              <label className="block font-medium mt-4">
                Fuel Receipt Proof
              </label>
              <input
                type="file"
                name="fuelReceiptProof"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
                accept="image/*"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelEditModal;
