"use client";

import React, { useState, useEffect } from "react";
import Sidebar2 from "../components/Sidebar2";
import Header from "../components/Header";
import {
  getProfile,
  updateAccount, updateOwnAccount,
  getOwnProfile,
} from "../services/authService";
const EditProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"account" | "profile">("account"); // Toggle between tabs
  const [profileSettings, setProfileSettings] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    contactNumber: "",
    contactPerson: "",
    contactPersonNumber: "",
  });

  const [accountSettings, setAccountSettings] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch account data
        const accountData = await getProfile();
        setAccountSettings({
          username: accountData.username,
          email: accountData.email,
          password: "",
          newPassword: "",
        });

        // Fetch profile data
        const profileData = await getOwnProfile();
        setProfileSettings({
          lastName: profileData.profile.last_name || "",
          firstName: profileData.profile.first_name || "",
          middleInitial: profileData.profile.middle_initial || "",
          address: profileData.profile.address || "",
          dateOfBirth: profileData.profile.date_of_birth || "",
          sex: profileData.profile.sex || "",
          contactNumber: profileData.profile.contact_number || "",
          contactPerson: profileData.profile.contact_person || "",
          contactPersonNumber: profileData.profile.contact_person_number || "",
        });

        setSelectedImage(profileData.profile.user_profile_image || null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileSettings({ ...profileSettings, [field]: value });
  };

  const handleAccountChange = (field: string, value: string) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("user_profile_image", file);
        await updateOwnAccount({ user_profile_image: file });
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Error updating profile image:", error);
        alert("Failed to update profile image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateAccount({
        username: accountSettings.username,
        email: accountSettings.email,
        password: accountSettings.newPassword,
      });
      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("Failed to update account settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Use the current state `profileSettings` for the payload
      await updateOwnAccount({
        lastName: profileSettings.lastName,
        firstName: profileSettings.firstName,
        middleInitial: profileSettings.middleInitial,
        address: profileSettings.address,
        dateOfBirth: profileSettings.dateOfBirth,
        sex: profileSettings.sex,
        contactNumber: profileSettings.contactNumber,
        contactPerson: profileSettings.contactPerson,
        contactPersonNumber: profileSettings.contactPersonNumber,
      });
      alert("Profile settings updated successfully!");
    } catch (error) {
      console.error("Error updating profile settings:", error);
      alert("Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-row bg-white">
      <Sidebar2 />
      <section className="right w-full bg-slate-200 overflow-y-hidden">
        <Header title="Edit Profile" />
        <div className="content flex flex-col h-full px-10 py-4">
          {loading && <p className="text-center">Loading...</p>}
          <div className="bg-white rounded-lg shadow-lg w-full px-6 py-4">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 mr-4 ${
                  activeTab === "account"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                } rounded-md`}
                onClick={() => setActiveTab("account")}
              >
                Account Settings
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                } rounded-md`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Settings
              </button>
            </div>

            {/* Account Settings Form */}
            {activeTab === "account" && (
              <form className="space-y-6" onSubmit={handleSubmitAccount}>
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Username</label>
                    <input
                      type="text"
                      value={accountSettings.username}
                      onChange={(e) =>
                        handleAccountChange("username", e.target.value)
                      }
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) =>
                        handleAccountChange("email", e.target.value)
                      }
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={accountSettings.newPassword}
                      onChange={(e) =>
                        handleAccountChange("newPassword", e.target.value)
                      }
                      className="block w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
                  >
                    Save Account Settings
                  </button>
                </div>
              </form>
            )}

            {/* Profile Settings Form */}
            {activeTab === "profile" && (
              <form className="space-y-6" onSubmit={handleSubmitProfile}>
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Last Name", field: "lastName" },
                    { label: "First Name", field: "firstName" },
                    { label: "Middle Initial", field: "middleInitial" },
                    { label: "Address", field: "address" },
                    {
                      label: "Date of Birth",
                      field: "dateOfBirth",
                      type: "date",
                    },
                    { label: "Sex", field: "sex" },
                    { label: "Contact Number", field: "contactNumber" },
                    { label: "Contact Person", field: "contactPerson" },
                    {
                      label: "Contact Person Number",
                      field: "contactPersonNumber",
                    },
                  ].map(({ label, field, type = "text" }) => (
                    <div key={field}>
                      <label>{label}</label>
                      <input
                        type={type}
                        value={
                          profileSettings[
                            field as keyof typeof profileSettings
                          ] || ""
                        }
                        onChange={(e) =>
                          handleProfileChange(field, e.target.value)
                        }
                        className="block w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-gray-700 mb-2">Profile Photo</label>
                    <div className="relative w-44 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {selectedImage ? (
                        <img
                          src={selectedImage as string}
                          alt="Profile"
                          className=" object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 inline-block mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Attachment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default EditProfile;
