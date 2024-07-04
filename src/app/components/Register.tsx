"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [emailRegistration, setEmailRegistration] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationPhone, setVerificationPhone] = useState("");
  const [errors, setErrors] = useState("");
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name == "password") {
      if (formData.password.length < 5) {
        setErrors("Password must be at least 6 characters");
      } else {
        setErrors("");
      }
    }
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleVerificationEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationEmail(e.target.value);
  };

  const handleVerificationPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationPhone(e.target.value);
  };

  const handleVerifyEmail = async () => {
    try {
      const payload = {
        email: verificationEmail,
        verificationCode,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Email verified successfully:", response.data);
      closeModal();

      // Try to login again after email verification
      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleVerifyPhone = async () => {
    try {
      const payload = {
        phone: verificationPhone,
        verificationCode,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Phone verified successfully:", response.data);
      closeModal();

      // Try to login again after phone verification
      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const loginPayload = {
        identifier: emailRegistration ? formData.email : formData.phone,
        password: formData.password,
      };

      console.log("Sending login request with payload:", loginPayload);

      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        loginPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", loginResponse.data);

      const token = loginResponse.data.access_token;
      console.log("token", token);

      // Set the token in cookies
      setCookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: 3, // 3 days
      });
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error response:", error.response?.data);
        if (error.response?.data.message === "Email is not verified") {
          setModalContent("Please verify your email.");
          setVerificationEmail(emailRegistration ? formData.email : "");
          openModal(true);
        } else if (error.response?.data.message === "Phone is not verified") {
          setModalContent("Please verify your phone.");
          setVerificationPhone(!emailRegistration ? formData.phone : "");
          openModal(true);
        } else {
          console.error("Error response:", error.response?.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        email: emailRegistration ? formData.email : undefined,
        phone: emailRegistration ? undefined : formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: "user", // Ensure role is passed correctly
      };

      // Register the user
      const registerResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", registerResponse.data);

      // Try to login after registration
      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration error response:",
          error.response?.data.message
        );
        const isArray = Array.isArray(error.response?.data.message);
        if (!isArray) {
          setErrors(error.response?.data.message);
        } else {
          setErrors(error.response?.data.message[0]);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  console.log(formData); // Log form data to check input values
  return (
    <div>
      <div>
        <form onSubmit={handleRegister}>
          <div>
            <label>
              <input
                type="radio"
                name="registrationType"
                value="email"
                checked={emailRegistration}
                onChange={() => setEmailRegistration(true)}
              />
              Email Registration
            </label>

            <label>
              <input
                type="radio"
                name="registrationType"
                value="phone"
                checked={!emailRegistration}
                onChange={() => setEmailRegistration(false)}
              />
              Phone Registration
            </label>
          </div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleInputChange}
          />
          {emailRegistration ? (
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          ) : (
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              onChange={handleInputChange}
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          {errors && <p style={{ color: "red" }}>{errors}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleInputChange}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Verification Needed</h2>
        <p>{modalContent}</p>
        {emailRegistration ? (
          <input
            type="email"
            placeholder="Enter your email"
            value={verificationEmail}
            onChange={handleVerificationEmailChange}
          />
        ) : (
          <input
            type="tel"
            placeholder="Enter your phone"
            value={verificationPhone}
            onChange={handleVerificationPhoneChange}
          />
        )}
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
        />
        <button
          onClick={emailRegistration ? handleVerifyEmail : handleVerifyPhone}>
          Submit
        </button>
      </CustomModal>
    </div>
  );
};

export default Register;
