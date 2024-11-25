"use client";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { FaSearch, FaPlus } from "react-icons/fa";

const MaintenanceRecordCard = ({ record, onEdit, onRemove }) => {
  return (
    <div className="record-box-container bg-white border-gray-200 rounded-lg border-2 flex flex-col p-4">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Maintenance ID:</td>
            <td className="border p-2">{record.maintenance_scheduling_id}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Status:</td>
            <td className="border p-2">
              <span
                className={`font-semibold ${
                  record.maintenance_status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {record.maintenance_status}
              </span>
            </td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Type:</td>
            <td className="border p-2">{record.maintenance_type}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Cost:</td>
            <td className="border p-2">PHP {record.maintenance_cost}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Date:</td>
            <td className="border p-2">{record.maintenance_date}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Mechanic:</td>
            <td className="border p-2">{record.attending_mechanic}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Address:</td>
            <td className="border p-2">{record.maintenance_address}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Description:</td>
            <td className="border p-2">{record.maintenance_type}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex space-x-2 mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const AddEditModal = ({ isOpen, onClose, record, onSave }) => {
  const [maintenanceNumber, setMaintenanceNumber] = useState(record?.maintenance_scheduling_id || "");
  const [attendingMechanic, setAttendingMechanic] = useState(record?.attending_mechanic || "");
  const [description, setDescription] = useState(record?.maintenance_type || "");
  const [maintenanceCost, setMaintenanceCost] = useState(record?.maintenance_cost || "");
  const [maintenanceDate, setMaintenanceDate] = useState(record?.maintenance_date || "");
  const [maintenanceAddress, setMaintenanceAddress] = useState(record?.maintenance_address || "");
  const [status, setStatus] = useState(record?.maintenance_status || "active");

  const toggleStatus = () => {
    setStatus((prev) => (prev === "active" ? "inactive" : "active"));
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    const updatedRecord = {
      maintenance_scheduling_id: maintenanceNumber,
      maintenance_type: description,
      maintenance_cost: maintenanceCost,
      maintenance_date: maintenanceDate,
      maintenance_address: maintenanceAddress,
      attending_mechanic: attendingMechanic,
      maintenance_status: status,
    };
    onSave(updatedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
        <h2 className="text-lg font-bold mb-4">
          {record ? "Edit Maintenance Record" : "Add New Maintenance Record"}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Maintenance ID</label>
            <input
              type="text"
              value={maintenanceNumber}
              onChange={(e) => setMaintenanceNumber(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Attending Mechanic</label>
            <input
              type="text"
              value={attendingMechanic}
              onChange={(e) => setAttendingMechanic(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="text"
              value={maintenanceCost}
              onChange={(e) => setMaintenanceCost(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={maintenanceDate}
              onChange={(e) => setMaintenanceDate(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={maintenanceAddress}
              onChange={(e) => setMaintenanceAddress(e.target.value)}
              className="border border-gray-500 p-3 rounded-md w-full mt-1"
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">Status:</label>
            <button
              className={`px-4 py-2 text-white rounded-md ${
                status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={toggleStatus}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-6 py-3 border border-gray-500 text-gray-500 rounded-md bg-transparent"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [records, setRecords] = useState([
    {
      maintenance_scheduling_id: "001",
      maintenance_status: "Active",
      maintenance_cost: "5000",
      maintenance_type: "Oil Change",
      maintenance_date: "2024-11-01",
      maintenance_address: "123 Main St",
      attending_mechanic: "John Doe",
    },
    {
      maintenance_scheduling_id: "002",
      maintenance_status: "Inactive",
      maintenance_cost: "12000",
      maintenance_type: "Brake Replacement",
      maintenance_date: "2024-10-15",
      maintenance_address: "456 Elm St",
      attending_mechanic: "Jane Smith",
    },
  ]);

  const handleSave = (record) => {
    if (currentRecord) {
      setRecords((prev) =>
        prev.map((r) =>
          r.maintenance_scheduling_id === record.maintenance_scheduling_id ? record : r
        )
      );
    } else {
      setRecords((prev) => [...prev, { ...record, maintenance_scheduling_id: Date.now().toString() }]);
    }
    setCurrentRecord(null);
    setIsModalOpen(false);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentRecord(null);
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    setRecords((prev) => prev.filter((record) => record.maintenance_scheduling_id !== id));
  };

  return (
    <Layout>
      <Header title="Bus Maintenance Management" />
      <div className="content flex flex-col flex-1">
        <div className="options flex items-center space-x-10 p-4 w-9/12 m-5 ml-10">
          <input
            type="text"
            placeholder="Find maintenance records"
            className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
            <FaSearch size={22} className="mr-2" />
            Search
          </button>
          <button
            className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
            onClick={handleAddNew}
          >
            <FaPlus size={22} className="mr-2" />
            Add New
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-6">
          {records.map((record) => (
            <MaintenanceRecordCard
              key={record.maintenance_scheduling_id}
              record={record}
              onEdit={() => handleEdit(record)}
              onRemove={() => handleRemove(record.maintenance_scheduling_id)}
            />
          ))}
        </div>
        <AddEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          record={currentRecord}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
};

export default DashboardHeader;
