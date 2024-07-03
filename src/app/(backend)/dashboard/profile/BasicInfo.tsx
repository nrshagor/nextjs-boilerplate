"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import React, { useEffect, useState } from "react";

const BasicInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastname: "",
    division: "",
    district: "",
    thana: "",
    postalCode: "",
    buildingAddress: "",
    profilePictureUrl: "",
  });

  const userId = auth()?.sub;
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        try {
          const token = getCookie("token");
          const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/user-info/${userId}`;

          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data;
          setFormData({
            firstName: userData.firstName,
            lastname: userData.lastname,
            division: userData.division,
            district: userData.district,
            thana: userData.thana,
            postalCode: userData.postalCode,
            buildingAddress: userData.buildingAddress,
            profilePictureUrl: userData.profilePictureUrl,
          });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Error response:", error.response?.data);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        lastname: formData.lastname,
        division: formData.division,
        district: formData.district,
        thana: formData.thana,
        postalCode: formData.postalCode,
        buildingAddress: formData.buildingAddress,
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`;
      const token = getCookie("token");

      // Update user information
      const response = await axios.put(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile update:", response.data);

      // If a file is selected, upload it
      if (file) {
        const formData = new FormData();
        formData.append("profilePictureUrl", file);

        const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile-picture`;

        const uploadResponse = await axios.put(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Image upload:", uploadResponse.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="division"
          placeholder="Division"
          value={formData.division}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="thana"
          placeholder="Thana"
          value={formData.thana}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="buildingAddress"
          placeholder="Building Address"
          value={formData.buildingAddress}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="profilePictureUrl"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div>
            <img
              src={previewUrl}
              alt="Profile Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>single image</p>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.profilePictureUrl}`}
          alt="Profile Preview"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
