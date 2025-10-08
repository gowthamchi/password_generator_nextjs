"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const text = "Welcome! Generate strong passwords and store them securely.";
    let index = 0;
    
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page-container">
      {/* Navbar */}
      <nav className="full-width-navbar">
        <h2 className="navbar-heading">Password Generator</h2>
      </nav>

      {/* Centered content */}
      <div className="home-content">
        <div className="typing-text-container">
          <p className="typing-text">{displayText}</p>
        </div>
        
        <div className="home-button-group">
          <button onClick={() => router.push("/signup")}>Sign Up</button>
          <button onClick={() => router.push("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
}