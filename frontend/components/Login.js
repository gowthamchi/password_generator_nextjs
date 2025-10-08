"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  function afterSubmit(e) {
    e.preventDefault();
    const userData = { email, password };

    fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success", data);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", data.email);
        router.push("/login/passwordgenerator");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={afterSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
