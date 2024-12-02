"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createProfile } from "@/app/services/userProfile";

const AddAssistantOfficerModal = ({ isOpen, onClose, onSave }) => {
  const [birthday, setBirthday] = useState<string>(""); // State to hold birthday
  const [age, setAge] = useState<number | string>(""); // State to hold calculated age
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_initial: "",
    position: "passenger_assistant_officer",
    license_number: "",
    sex: "Male",
    contact_number: "",
    contact_person: "",
    contact_person_number: "",
    address: "",
    user_profile_image: "",
  });

  // Calculate age based on birthday
  useEffect(() => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(""); // Clear age if no birthday is provided
    }
  }, [birthday]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date of birth change
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  // Photo upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          user_profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const profileData = {
        ...formData,
        date_of_birth: birthday, // Include birthday in profile data
      };
      const response = await createProfile(profileData); // Call createProfile service
      if (response && response.profile) {
        onSave(response.profile); // Pass the newly created profile to the parent component
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add Passenger Assistant Officer Record</h2>
        <div className="form grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <h1>Last Name</h1>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="Last Name"
            />
            <h1>First Name</h1>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="First Name"
            />
            <h1>Middle Initial</h1>
            <Input
              name="middle_initial"
              value={formData.middle_initial}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="M.I."
            />
            <h1>Position</h1>
            <Input
              name="position"
              value="Passenger Assistant Officer"
              className="h-10 text-lg"
              disabled
            />
            <h1>License Number</h1>
            <Input
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="License Number"
            />
            <h1>Date of Birth</h1>
            <Input
              name="birthday"
              value={birthday}
              onChange={handleBirthdayChange}
              className="h-10 text-lg"
              type="date"
            />
          </div>
          <div className="col-span-1">
            <h1>Age</h1>
            <Input value={age} className="h-10 text-lg" readOnly />
            <h1>Gender</h1>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="h-10 text-lg border rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <h1>Contact Number</h1>
            <Input
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="Contact Number"
            />
            <h1>Contact Person</h1>
            <Input
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="Contact Person"
            />
            <h1>Contact Person Number</h1>
            <Input
              name="contact_person_number"
              value={formData.contact_person_number}
              onChange={handleInputChange}
              className="h-10 text-lg"
              placeholder="Contact Person Number"
            />
            <h1>Address</h1>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full h-24 border rounded-md p-2"
              placeholder="Address"
            />
          </div>
          <div className="col-span-2 flex flex-col items-center mt-6">
            <div className="relative w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full">
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {formData.user_profile_image && (
                <img
                  src={formData.user_profile_image}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssistantOfficerModal;
