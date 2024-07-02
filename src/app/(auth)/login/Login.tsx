"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdentifier, setVerificationIdentifier] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(true);

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "identifier") setIdentifier(value);
    if (name === "password") setPassword(value);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleVerificationIdentifierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationIdentifier(e.target.value);
    console.log(e.target.value);
  };

  const handleVerify = async () => {
    try {
      const payload = isEmailLogin
        ? { email: verificationIdentifier, verificationCode }
        : { phone: verificationIdentifier, verificationCode };

      const url = isEmailLogin
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Verification successful:", response.data);
      closeModal();

      // Try to login again after verification
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
        identifier,
        password,
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
      // Redirect to the home route after successful login
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error response:", error.response?.data);
        if (error.response?.data.message === "Email is not verified") {
          setModalContent("Please verify your email.");
          setVerificationIdentifier(identifier);
          setIsEmailLogin(true);
          openModal(true);
        } else if (error.response?.data.message === "Phone is not verified") {
          setModalContent("Please verify your phone.");
          setVerificationIdentifier(identifier);
          setIsEmailLogin(false);
          openModal(true);
        } else {
          console.error("Error response:", error.response?.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin();
  };
  // passowrd show and hide
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="loginType"
              value="email"
              checked={isEmailLogin}
              onChange={() => setIsEmailLogin(true)}
            />
            Email Login
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="phone"
              checked={!isEmailLogin}
              onChange={() => setIsEmailLogin(false)}
            />
            Phone Login
          </label>
        </div>
        <input
          type="text"
          name="identifier"
          placeholder={isEmailLogin ? "Email" : "Phone"}
          onChange={handleInputChange}
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"}
        </button>
        <br />
        <button type="submit">Login</button>
      </form>

      {/* Verification Modal */}

      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Verification Needed</h2>
        <p>{modalContent}</p>
        <input
          type="text"
          placeholder={isEmailLogin ? "Enter your email" : "Enter your phone"}
          value={verificationIdentifier}
          onChange={handleVerificationIdentifierChange}
        />

        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
        />
        <button onClick={handleVerify}>Submit</button>
      </CustomModal>
      <Link href="/forget-password">Forget Password</Link>
    </div>
  );
};

export default Login;
