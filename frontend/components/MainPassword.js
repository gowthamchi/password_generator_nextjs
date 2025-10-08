"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function MainPassword() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(8);
  const [websitename, setWebsiteName] = useState("");
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  function generatePassword() {
    let chars = "";
    if (includeLetters) chars += letters;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (!chars) {
      alert("Please select at least one type");
      return;
    }

    let generated = "";
    for (let i = 0; i < number; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(generated);
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  }

  if (!checked) return null;

  const email = localStorage.getItem("email");

  function afterSubmit(e) {
    e.preventDefault();
    const userData = { email, url, password, websitename };

    fetch(`${API_BASE_URL}/api/mainpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success", data);
        router.push("/login/passwordgenerator/allpasswords");
      })
      .catch((err) => console.log(err));
  }

  function viewPasswords() {
    router.push("/login/passwordgenerator/allpasswords");
  }

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setPassword("");
    }, 1000);
  };

  return (
    <div className="main-password-page">
      <nav className="navbar">
        <h2 className="navbar-heading">Password Generator</h2>
        <div className="nav-buttons">
          <button onClick={viewPasswords}>View Passwords</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="generator-section">
        <div className="input-group">
          <h3>Password Length</h3>
          <input
            type="number"
            min="8"
            max="32"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        </div>

        <div className="input-group">
          <h3>Include Characters</h3>
          <label>
            <input
              type="checkbox"
              checked={includeLetters}
              onChange={(e) => setIncludeLetters(e.target.checked)}
            />{" "}
            Letters
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />{" "}
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />{" "}
            Symbols
          </label>
        </div>

        <button className="generate-btn" onClick={generatePassword}>
          Generate Password
        </button>

        <div className="copy-container">
          <input type="text" value={password} readOnly />
          <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
        </div>

        <form className="password-form" onSubmit={afterSubmit}>
          <input
            type="text"
            placeholder="Enter website name"
            value={websitename}
            onChange={(e) => setWebsiteName(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default MainPassword;
