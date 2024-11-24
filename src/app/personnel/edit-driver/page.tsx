"use client";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createProfile, updateProfile, getUserProfile } from "@/app/services/userProfile"; // Import the updateProfile and getUserProfile services

const DashboardHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [birthday, setBirthday] = useState<string>("");
  const [age, setAge] = useState<number | string>("");
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_initial: "",
    position: "driver",
    license_number: "",
    sex: "Male",
    contact_number: "",
    contact_person: "",
    contact_person_number: "",
    address: "",
    user_profile_image: "",
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user_profile_id } = router.query; // Assuming user_profile_id is passed via router query

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = await getUserProfile(user_profile_id); // Fetch the user profile
        setFormData(userProfileData);
        setBirthday(userProfileData.date_of_birth); // Set the birthday for age calculation
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user_profile_id) {
      fetchUserProfile();
    }
  }, [user_profile_id]);

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
          user_profile_image: reader.result as string, // Update the correct field
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const PhotoUpload = () => (
    <div className="relative w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0"
      />
      {formData.user_profile_image ? (
        <img
          src={formData.user_profile_image}
          alt="Profile Preview"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-gray-500 text-center">Add Profile Photo</span>
      )}
    </div>
  );

  // Handle form submission to update profile
  const handleSubmit = async () => {
    try {
      const profileData = {
        last_name: formData.last_name,
        first_name: formData.first_name,
        middle_initial: formData.middle_initial,
        position: formData.position,
        license_number: formData.license_number,
        sex: formData.sex,
        contact_number: formData.contact_number,
        contact_person: formData.contact_person,
        contact_person_number: formData.contact_person_number,
        address: formData.address,
        date_of_birth: birthday,
        photo: formData.user_profile_image,
      };
      await updateProfile(user_profile_id, profileData); // Call updateProfile function
      router.push("/personnel");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    router.push("/personnel");
  };

  return (
    <section className="h-screen flex flex-row bg-white ">
      <Sidebar />

      <section className="w-full bg-slate-200">
        <Header title="Edit Driver Record" /> {/* Update title for edit functionality */}

        <section className="right w-full overflow-y-hidden">
          <div className="forms-container ml-14">
            <div className="output flex flex-row space-x-2 mt-20">
              <div className="forms flex w-11/12 bg-white h-160 rounded-lg border-1 border-gray-300">
                <div className="1st-row flex-col m-5 ml-14 w-96 space-y-4">
                  <h1>Last Name</h1>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: Callo"
                  />
                  <h1>First Name</h1>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: Juan"
                  />
                  <h1>Middle Initial</h1>
                  <Input
                    name="middle_initial"
                    value={formData.middle_initial}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: V"
                  />
                  <h1>Position</h1>
                  <Input
                    name="position"
                    value="Driver"
                    className="h-10 text-lg"
                    type="text"
                    disabled
                  />
                  <h1>License Number:</h1>
                  <Input
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: N03-12-123456"
                  />
                  <h1>Date of Birth</h1>
                  <Input
                    name="birthday"
                    value={birthday}
                    onChange={handleBirthdayChange}
                    className="h-10 text-lg"
                    type="date"
                    placeholder="Select Date of Birth"
                  />
                </div>
                <div className="2nd-row flex-col m-5 w-96 space-y-4">
                  <h1>Age</h1>
                  <Input
                    className="h-10 text-lg"
                    type="text"
                    value={age}
                    readOnly
                  />
                  <h1>Gender</h1>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="h-10 text-lg border-2 rounded-lg p-2"
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
                    type="text"
                    placeholder="ex: 09123456789"
                  />
                  <h1>Contact Person</h1>
                  <Input
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: Jose"
                  />
                  <h1>Contact Person Number</h1>
                  <Input
                    name="contact_person_number"
                    value={formData.contact_person_number}
                    onChange={handleInputChange}
                    className="h-10 text-lg"
                    type="text"
                    placeholder="ex: 09123456789"
                  />
                  <h1>Address</h1>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-20 text-lg border-2 rounded-lg p-2"
                    placeholder="ex: Brgy. 123, City, Province"
                  />
                </div>
              </div>
              <div className="photo-upload-container flex flex-col items-center space-y-4 mt-10">
                <PhotoUpload />
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-red-500 text-white rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default DashboardHeader;
