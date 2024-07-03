"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import Image from "next/image";
import Link from "next/link";
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
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [multiplePreviewUrls, setMultiplePreviewUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setMultipleFiles(selectedFiles);
      setMultiplePreviewUrls(
        selectedFiles.map((file) => URL.createObjectURL(file))
      );
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
          setUploadedImageUrls(userData.profilePictureUrls || []);
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

        // Update the state with the new uploaded single image's URL
        setFormData((prevState) => ({
          ...prevState,
          profilePictureUrl: uploadResponse.data.profilePictureUrl,
        }));

        // Clear the single image preview
        setFile(null);
        setPreviewUrl(null);
      }

      // If multiple files are selected, upload them
      if (multipleFiles.length > 0) {
        const multipleFormData = new FormData();
        multipleFiles.forEach((file) => {
          multipleFormData.append("files", file);
        });

        const multipleUploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile-pictures`;

        const multipleUploadResponse = await axios.put(
          multipleUploadUrl,
          multipleFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Multiple image upload:", multipleUploadResponse.data);

        // Update the state with the new uploaded images' URLs
        setUploadedImageUrls(
          multipleUploadResponse.data.profilePictureUrls || []
        );

        // Clear the multiple images preview
        setMultipleFiles([]);
        setMultiplePreviewUrls([]);
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
            <Image
              src={previewUrl}
              alt="Profile Preview"
              width={100}
              height={100}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          onChange={handleMultipleFileChange}
        />
        {multiplePreviewUrls.length > 0 && (
          <div>
            {multiplePreviewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Single image:</p>
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.profilePictureUrl}`}
          alt="Profile"
          width={100}
          height={100}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      </div>
      <div>
        <p>Multiple images:</p>
        <div>
          {uploadedImageUrls.map((url, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_API_URL}/${url}`}
              alt={`Uploaded ${index}`}
              width={100}
              height={100}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                margin: "5px",
              }}
            />
          ))}
        </div>
      </div>
      <Link href="change-password">change-password</Link>
    </div>
  );
};

export default BasicInfo;
