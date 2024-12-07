import React from "react";

const ViewProofModal = ({ isOpen, onClose, proof, onReturnToActive }) => {
  const BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://192.168.68.147:8000/storage/";

  const renderImage = (imagePath, altText) => {
    if (!imagePath) {
      return (
        <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
          No Image Available
        </div>
      );
    }

    const fullUrl = `${BASE_URL}${imagePath}`;
    console.log("Rendering image with URL:", fullUrl);

    return (
      <img
        src={fullUrl}
        alt={altText}
        className="w-full border border-gray-300 p-2 rounded"
        onError={(e) => (e.target.src = "/placeholder-image.png")} // Fallback for broken images
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <h2 className="text-xl font-bold mb-6">Completion Proof</h2>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <label className="block font-medium mb-2">Proof Image</label>
            {renderImage(proof, "Completion Proof")}
          </div>
          <div className="w-1/2 pl-4">
            <label className="block font-medium">Details</label>
            <p className="border border-gray-300 p-2 rounded bg-gray-100">
              Proof related to the maintenance task is displayed here.
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProofModal;
