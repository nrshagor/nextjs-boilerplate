"use client";
import React, { useState } from "react";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [message, setMessage] = useState("");

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/change-password",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        setMessage(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleInputChange}
          />
          <button type="button" onClick={toggleOldPasswordVisibility}>
            {showOldPassword ? "Hide" : "Show"} Password
          </button>
        </div>
        <div>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          <button type="button" onClick={toggleNewPasswordVisibility}>
            {showNewPassword ? "Hide" : "Show"} Password
          </button>
        </div>
        <div>
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
          />
          <button type="button" onClick={toggleConfirmNewPasswordVisibility}>
            {showConfirmNewPassword ? "Hide" : "Show"} Password
          </button>
        </div>
        <div>
          <button type="submit">Change Password</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePasswordPage;
