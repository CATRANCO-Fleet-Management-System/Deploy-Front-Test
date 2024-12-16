// components/Confirmpopup.tsx
import React from "react";

interface ConfirmpopupProps {
  isOpen: boolean;
  onClose: () => void; // Close handler passed as onClose
  onConfirm: () => void; // Confirm handler passed as onConfirm
}

const Confirmpopup: React.FC<ConfirmpopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null; // Don't render if modal isn't open

  const handleCancel = () => {
    console.log("Cancel button clicked");
    onClose(); // Call onClose when cancel is clicked
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked");
    onConfirm(); // Call onConfirm when confirm is clicked
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmpopup;
