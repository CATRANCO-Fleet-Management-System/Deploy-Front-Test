import React, { useState, useEffect, useRef } from "react";

interface BusBoxProps {
  busNumber: string;
  ORNumber: string;
  CRNumber: string;
  plateNumber: string;
  thirdLBI: string;
  comprehensiveInsurance?: string;
  assignedDriver: string; // New field
  assignedPAO: string; // New field
  route: string; // New field
  onDelete: () => void;
}

const BusRecord: React.FC<BusBoxProps> = ({
  busNumber,
  ORNumber,
  CRNumber,
  plateNumber,
  thirdLBI,
  comprehensiveInsurance,
  assignedDriver,
  assignedPAO,
  route,
  onDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Bus Number:</td>
            <td className="border p-2">{busNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">OR Number:</td>
            <td className="border p-2">{ORNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">CR Number:</td>
            <td className="border p-2">{CRNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Plate Number:</td>
            <td className="border p-2">{plateNumber}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Third LBI:</td>
            <td className="border p-2">{thirdLBI}</td>
          </tr>
          {comprehensiveInsurance && (
            <tr>
              <td className="border p-2 font-bold">Comprehensive Insurance:</td>
              <td className="border p-2">{comprehensiveInsurance}</td>
            </tr>
          )}
          <tr>
            <td className="border p-2 font-bold">Assigned Driver:</td>
            <td className="border p-2">{assignedDriver}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Assigned PAO:</td>
            <td className="border p-2">{assignedPAO}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Route:</td>
            <td className="border p-2">{route}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex space-y-2 mt-4 flex-col">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          onClick={onDelete}
        >
          Remove
        </button>

        <div className="relative w-full" ref={dropdownRef}>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={toggleDropdown}
          >
            Edit
          </button>
          {dropdownOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-4/5 bg-white border border-gray-300 rounded shadow-lg z-10">
              <a
                href={`/bus-profiles/bus-update/update-data-bus?busNumber=${busNumber}`}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Bus Record
              </a>
              <a
                href={`/bus-profiles/bus-update/update-personnel?busNumber=${busNumber}`}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Personnel Assignment
              </a>
            </div>
          )}
        </div>

        <a
          href={`/bus-profiles/bus-records/${busNumber}`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-center"
        >
          View Bus Full Record
        </a>
      </div>
    </div>
  );
};

export default BusRecord;
