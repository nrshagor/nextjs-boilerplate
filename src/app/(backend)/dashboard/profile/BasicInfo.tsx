"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
export interface DecodedToken {
  sub: number; // Example property types; adjust as per your JWT structure
  email: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: any; // Allow for additional properties
}
const BasicInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastname: "",
    division: "",
    district: "",
    thana: "",
    postalCode: "",
    buildingAddress: "",
  });

  const userId = auth()?.sub;

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await axios.put(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile update:", response.data);
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BasicInfo;
