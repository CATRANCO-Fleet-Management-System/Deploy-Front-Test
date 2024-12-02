"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { updateProfile, getProfileById } from "@/app/services/userProfile";

const EditAssistantOfficerModal = ({ isOpen, onClose, userProfileId, onSave }) => {
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number | string>("");
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

  // Fetch user profile data when the modal is opened
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userProfileId) return;
      try {
        const response = await getProfileById(userProfileId); // Fetch data from the backend
        const userProfileData = response.profile; // Extract profile from response

        // Set form fields
        setFormData({
          last_name: userProfileData.last_name || "",
          first_name: userProfileData.first_name || "",
          middle_initial: userProfileData.middle_initial || "",
          position: userProfileData.position || "passenger_assistant_officer",
          license_number: userProfileData.license_number || "",
          sex: userProfileData.sex || "Male",
          contact_number: userProfileData.contact_number || "",
          contact_person: userProfileData.contact_person || "",
          contact_person_number: userProfileData.contact_person_number || "",
          address: userProfileData.address || "",
          user_profile_image: userProfileData.user_profile_image || "",
        });
        setBirthday(userProfileData.date_of_birth || ""); // Set birthday for age calculation
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [userProfileId, isOpen]);

  // Calculate age whenever the birthday changes
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
      setAge("");
    }
  }, [birthday]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

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

  const handleSubmit = async () => {
    try {
      const updatedProfile = {
        ...formData,
        date_of_birth: birthday,
      };
      if (!userProfileId) {
        console.error("Error: userProfileId is missing");
        return;
      }
      await updateProfile(userProfileId, updatedProfile);
      onSave({ ...updatedProfile, user_profile_id: userProfileId }); // Notify the parent with updated profile
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Edit Assistant Officer Record</h2>
        <div className="form grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <h1>Last Name</h1>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <h1>First Name</h1>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <h1>Middle Initial</h1>
            <Input
              name="middle_initial"
              value={formData.middle_initial}
              onChange={handleInputChange}
              placeholder="M.I."
            />
            <h1>Position</h1>
            <Input name="position" value="Passenger Assistant Officer" disabled />
            <h1>License Number</h1>
            <Input
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              placeholder="License Number"
            />
            <h1>Date of Birth</h1>
            <Input
              name="birthday"
              value={birthday}
              onChange={handleBirthdayChange}
              type="date"
            />
          </div>
          <div className="col-span-1">
            <h1>Age</h1>
            <Input value={age} readOnly />
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
            />
            <h1>Contact Person</h1>
            <Input
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
            />
            <h1>Contact Person Number</h1>
            <Input
              name="contact_person_number"
              value={formData.contact_person_number}
              onChange={handleInputChange}
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
        </div>
        <div className="photo-upload-container flex flex-col items-center space-y-4 mt-6">
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
          <div className="flex justify-end space-x-4 mt-4">
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
    </div>
  );
};

export default EditAssistantOfficerModal;
