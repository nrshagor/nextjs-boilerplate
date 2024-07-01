import Link from "next/link";
import React from "react";
import "../style/navbar.scss";
import LogoutButton from "./LogoutButton";
const Navbar = () => {
  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">register</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/profile">Profile</Link>
      <LogoutButton />
    </div>
  );
};

export default Navbar;
