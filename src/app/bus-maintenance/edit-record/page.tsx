"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllVehicles } from "@/app/services/vehicleService";  
import { getMaintenanceSchedulingById, updateMaintenanceScheduling } from "@/app/services/maintenanceService";  

const EditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();  
  const maintenanceId = searchParams.get("id");  

  const [vehicles, setVehicles] = useState([]);  
  const [maintenanceNumber, setMaintenanceNumber] = useState("");
  const [vehicleId, setVehicleId] = useState("");  
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());
  const [maintenanceAddress, setMaintenanceAddress] = useState("");
  const [description, setDescription] = useState("");
  const [attendingMechanic, setAttendingMechanic] = useState("");
  const [maintenanceType, setMaintenanceType] = useState(""); // New state for maintenance type
  const [maintenanceStatus, setMaintenanceStatus] = useState(""); // New state for maintenance status
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState("");  

  // Fetch all vehicles and maintenance record on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicleData = await getAllVehicles();
        setVehicles(vehicleData);
  
        if (maintenanceId) {
          console.log("Fetching maintenance data for ID:", maintenanceId);
          const maintenanceData = await getMaintenanceSchedulingById(maintenanceId);
          console.log("Maintenance data fetched:", maintenanceData);
  
          if (maintenanceData) {
            // Populate state with fetched data
            setMaintenanceNumber(maintenanceData.maintenance_id || ""); // Ensure string value
            setVehicleId(maintenanceData.vehicle_id || ""); // Ensure string value
            setMaintenanceCost(maintenanceData.maintenance_cost || ""); // Ensure string value
            setMaintenanceDate(new Date(maintenanceData.maintenance_date)); // Ensure valid date object
            setMaintenanceAddress(maintenanceData.maintenance_address || ""); // Ensure string value
            setDescription(maintenanceData.maintenance_type || ""); // Ensure string value
            setAttendingMechanic(maintenanceData.attending_mechanic || ""); // Ensure string value
            setMaintenanceType(maintenanceData.maintenance_type || ""); // Ensure string value for maintenance type
            setMaintenanceStatus(maintenanceData.maintenance_status || ""); // Ensure string value for maintenance status
          } else {
            setError("Maintenance record not found.");
          }
        } else {
          setError("Invalid maintenance ID.");
        }
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching vehicles or maintenance record:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [maintenanceId]);
  
  // Handle form submission (update functionality)
  const handleUpdate = async () => {
    const updatedData = {};
    
    // Update only fields that are filled
    if (maintenanceNumber) updatedData.maintenance_id = maintenanceNumber;
    if (vehicleId) updatedData.vehicle_id = vehicleId; // Ensure vehicle ID is included
    if (attendingMechanic) updatedData.attending_mechanic = attendingMechanic;
    if (description) updatedData.maintenance_type = description; // Use description as maintenance type
    if (maintenanceType) updatedData.maintenance_type = maintenanceType; // Include maintenance type
    if (maintenanceCost) updatedData.maintenance_cost = maintenanceCost;
    if (maintenanceDate) updatedData.maintenance_date = maintenanceDate.toISOString().split('T')[0]; // Formatting to YYYY-MM-DD
    if (maintenanceAddress) updatedData.maintenance_address = maintenanceAddress;
    if (maintenanceStatus) updatedData.maintenance_status = maintenanceStatus; // Include maintenance status

    // Basic validation
    if (Object.keys(updatedData).length === 0) {
      setError("No fields to update. Please fill in at least one field.");
      return;
    }

    console.log("Updating maintenance record with data:", updatedData);
  
    try {
      await updateMaintenanceScheduling(maintenanceId, updatedData);
      console.log("Update successful, redirecting to /bus-maintenance");
      router.push("/bus-maintenance");
    } catch (error) {
      setError("Error updating maintenance scheduling. Please try again.");
      console.error("Error updating maintenance scheduling:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <section className="flex flex-row h-screen bg-white">
      <Sidebar />
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Edit Maintenance Record" />
        <div className="content flex flex-col flex-1 p-10 items-center">
          {error && <div className="text-red-500">{error}</div>}  
          <div className="form grid grid-cols-2 gap-6 bg-white p-12 rounded-md shadow-md w-[1000px] mr-14">
            <div className="col-span-1">
              <label htmlFor="maintenanceNumber" className="block text-sm font-medium text-gray-700">Maintenance #</label>
              <Input
                id="maintenanceNumber"
                placeholder="Maintenance #"
                value={maintenanceNumber}
                onChange={(e) => setMaintenanceNumber(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Vehicle ID</label>
              <Input
                id="vehicleId"
                placeholder="Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="mt-1 p-3"
                disabled // Disable input as it's being fetched
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="attendingMechanic" className="block text-sm font-medium text-gray-700">Attending Mechanic</label>
              <Input
                id="attendingMechanic"
                placeholder="Attending Mechanic"
                value={attendingMechanic}
                onChange={(e) => setAttendingMechanic(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Maintenance Type</label>
              <textarea
                id="description"
                placeholder="Maintenance Type"
                className="border border-gray-500 p-3 rounded-md w-full h-32 mt-1"
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceCost" className="block text-sm font-medium text-gray-700">Maintenance Cost</label>
              <Input
                id="maintenanceCost"
                placeholder="PHP"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceDate" className="block text-sm font-medium text-gray-700">Maintenance Date</label>
              <DatePicker
                id="maintenanceDate"
                selected={maintenanceDate}
                onChange={(date) => setMaintenanceDate(date)}
                className="border border-gray-500 p-3 rounded-md w-full mt-1"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceAddress" className="block text-sm font-medium text-gray-700">Maintenance Address</label>
              <Input
                id="maintenanceAddress"
                placeholder="Maintenance Address"
                value={maintenanceAddress}
                onChange={(e) => setMaintenanceAddress(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceStatus" className="block text-sm font-medium text-gray-700">Maintenance Status</label>
              <Input
                id="maintenanceStatus"
                placeholder="Maintenance Status"
                value={maintenanceStatus}
                onChange={(e) => setMaintenanceStatus(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-2 flex justify-end space-x-4 mt-4">
              <button
                className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md bg-transparent"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="px-6 py-3 border border-red-500 text-red-500 rounded-md bg-transparent"
                onClick={() => router.push("/bus-maintenance")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditPage;
