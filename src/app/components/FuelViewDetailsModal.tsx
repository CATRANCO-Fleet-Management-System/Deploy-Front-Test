import React, { useState, useEffect } from "react";
import { FaBus } from "react-icons/fa";

// Define the type for the fuel view data
interface FuelViewData {
  purchase_date?: string;
  odometer_km?: string;
  fuel_price?: string;
  fuel_type?: string;
  fuel_liters_quantity?: string;
  total_expense?: string;
  odometer_distance_proof?: string | null;
  fuel_receipt_proof?: string | null;
}

const FuelViewDetailsModal = ({
  selectedBus,
  viewData = {}, // Default value is an empty object
  onClose = () => {},
}: {
  selectedBus: string;
  viewData: FuelViewData;
  onClose: () => void;
}) => {
  const {
    purchase_date = "N/A",
    odometer_km = "N/A",
    fuel_price = "N/A",
    fuel_type = "N/A",
    fuel_liters_quantity = "N/A",
    total_expense,
    odometer_distance_proof = null,
    fuel_receipt_proof = null,
  } = viewData;

  const [isOdometerImageLoading, setIsOdometerImageLoading] = useState(true);
  const [isFuelReceiptImageLoading, setIsFuelReceiptImageLoading] =
    useState(true);
  const [odometerImageError, setOdometerImageError] = useState(false);
  const [fuelReceiptImageError, setFuelReceiptImageError] = useState(false);

  const calculatedTotalExpense =
    total_expense ||
    (!isNaN(parseFloat(fuel_price)) && !isNaN(parseFloat(fuel_liters_quantity))
      ? (parseFloat(fuel_price) * parseFloat(fuel_liters_quantity)).toFixed(2)
      : "N/A");

  const BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "https://catranco.jwisnetwork.com/storage/";

  const formatDate = (date) => {
    if (!date || date === "N/A") return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageError = (type) => {
    if (type === "odometer") {
      setOdometerImageError(true);
      setIsOdometerImageLoading(false);
    } else if (type === "fuelReceipt") {
      setFuelReceiptImageError(true);
      setIsFuelReceiptImageLoading(false);
    }
  };

  const handleImageLoad = (type) => {
    if (type === "odometer") {
      setIsOdometerImageLoading(false);
    } else if (type === "fuelReceipt") {
      setIsFuelReceiptImageLoading(false);
    }
  };

  useEffect(() => {
    if (odometer_distance_proof) {
      setIsOdometerImageLoading(true);
      setOdometerImageError(false);
    }
    if (fuel_receipt_proof) {
      setIsFuelReceiptImageLoading(true);
      setFuelReceiptImageError(false);
    }
  }, [odometer_distance_proof, fuel_receipt_proof]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <div className="flex items-center mb-6">
          <FaBus size={32} className="mr-3" />
          <span className="text-xl font-bold">BUS {selectedBus}</span>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left Section */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Date</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {formatDate(purchase_date)}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Odometer (KM)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {odometer_km}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Type</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_type}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Price (PHP)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_price}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Quantity (L)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_liters_quantity}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Total Expense (PHP)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {calculatedTotalExpense}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Odometer Proof</label>
              {odometerImageError ? (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  Failed to load image
                </div>
              ) : isOdometerImageLoading ? (
                <div className="w-full h-48 flex justify-center items-center border border-gray-300 p-2 rounded bg-gray-100">
                  <span>Loading...</span>
                </div>
              ) : odometer_distance_proof ? (
                <img
                  src={`${BASE_URL}${odometer_distance_proof}`}
                  alt={`Odometer proof for Bus ${selectedBus}`}
                  className="max-h-48 w-auto border border-gray-300 p-2 rounded"
                  onError={() => handleImageError("odometer")}
                  onLoad={() => handleImageLoad("odometer")}
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Receipt Proof</label>
              {fuelReceiptImageError ? (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  Failed to load image
                </div>
              ) : isFuelReceiptImageLoading ? (
                <div className="w-full h-48 flex justify-center items-center border border-gray-300 p-2 rounded bg-gray-100">
                  <span>Loading...</span>
                </div>
              ) : fuel_receipt_proof ? (
                <img
                  src={`${BASE_URL}${fuel_receipt_proof}`}
                  alt={`Fuel receipt proof for Bus ${selectedBus}`}
                  className="max-h-48 w-auto border border-gray-300 p-2 rounded"
                  onError={() => handleImageError("fuelReceipt")}
                  onLoad={() => handleImageLoad("fuelReceipt")}
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelViewDetailsModal;
