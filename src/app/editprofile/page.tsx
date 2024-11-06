"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar2 from "../components/Sidebar2";
import Header from "../components/Header";
import { FaUser } from "react-icons/fa";
import { getProfile, updateProfile } from "../services/authService"; // Import the functions

const Profile: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [profile, setProfile] = useState<any>({}); // Add state for profile data
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
        setSelectedImage(profileData.profileImage); // Assuming profileImage is part of the response
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prepare profile data for update
    const updatedProfile = {
      ...profile,
      profileImage: selectedImage, // Include updated image
    };

    try {
      setLoading(true);
      await updateProfile(updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar2 />
      <section className="right w-full bg-slate-200 overflow-y-hidden">
        <Header title="" />

        <div className="content flex flex-col h-full p-10">
          <div className="bg-white rounded-lg shadow-lg w-full p-6">
            <div className="mb-4 flex items-center">
              <FaUser size={30} className="mr-4 text-gray-700" />
              <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID #</label>
                  <input
                    type="text"
                    value={profile.employeeId || ""}
                    onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                  <div className="relative w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0"
                    />
                    {selectedImage ? (
                      <img
                        src={selectedImage as string}
                        alt="Profile Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500 text-center">Add Profile Photo</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={profile.username || ""}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact #</label>
                  <input
                    type="text"
                    value={profile.contactNumber || ""}
                    onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={profile.password || ""}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={profile.newPassword || ""}
                    onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Profile;
