"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const route = useRouter();
  const [verificationIdentifier, setVerificationIdentifier] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [formData, setFormData] = useState({
    identifier: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(value);
  };

  const handleVerificationIdentifierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationIdentifier(e.target.value);
    console.log(e.target.value);
  };

  const handleForgetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { identifier: verificationIdentifier };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`;
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log();
      if (response?.data?.message == "Password reset code sent") {
        openModal(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleVerify = async () => {
    try {
      const payload = {
        identifier: verificationIdentifier,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("reset password successful:", response.data);
      closeModal();
      route.push("/login");

      // Try to login again after reset password
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
      <input
        type="text"
        placeholder={"Enter your email or Enter your phone"}
        value={verificationIdentifier}
        onChange={handleVerificationIdentifierChange}
      />
      <button onClick={handleForgetPassword}>Forget password</button>
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Verification Needed</h2>
        <p>{modalContent}</p>
        <input
          type="text"
          name="identifier"
          placeholder="Email or Phone Number"
          value={verificationIdentifier}
          onChange={handleInputChange}
          hidden
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Password"
          onChange={handleInputChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="resetCode"
          placeholder="Enter verification code"
          onChange={handleInputChange}
        />
        <button onClick={handleVerify}>Submit</button>
      </CustomModal>
    </div>
  );
};

export default Page;
