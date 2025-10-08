"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function RetrieveData() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("email");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setChecked(true);
    fetchPasswords(email);
  }, [router]);

  const fetchPasswords = (email) => {
    fetch(`${API_BASE_URL}/api/allpasswords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVaultData(data.data || []);
        setFilteredData(data.data || []);
      })
      .catch((err) => console.log("Error:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    fetch(`${API_BASE_URL}/api/deletepassword/` + id, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        const updatedData = vaultData.filter((item) => item._id !== id);
        setVaultData(updatedData);
        setFilteredData(updatedData);
      })
      .catch((err) => console.log("Delete error:", err));
  };

  const handleEdit = (id) => {
    const newPassword = window.prompt("Enter new password:");
    if (!newPassword) return;

    fetch(`${API_BASE_URL}/api/updatepassword/`+ id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedData = vaultData.map((item) =>
          item._id === id ? { ...item, password: newPassword } : item
        );
        setVaultData(updatedData);
        setFilteredData(updatedData);
      })
      .catch((err) => console.log("Update error:", err));
  };

  useEffect(() => {
    if (!searchTerm) setFilteredData(vaultData);
    else {
      const filtered = vaultData.filter(
        (item) =>
          item.websitename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, vaultData]);

  if (!checked) return null;

  return (
    <div className="vault-page">
      {/* Navbar Full Width */}
      <nav className="navbar full-width-navbar">
        <h2 className="navbar-heading">Password Generator</h2>
        <div className="nav-buttons">
          <button onClick={() => router.push("/login/passwordgenerator")}>Home</button>
          <button onClick={() => { localStorage.removeItem("isLoggedIn"); router.push("/login"); }}>Logout</button>
        </div>
      </nav>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by website or URL"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Table */}
      <table className="vault-table">
        <thead>
          <tr>
            <th>Website Name</th>
            <th>URL</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.websitename}</td>
              <td>{item.url}</td>
              <td>{item.password}</td>
              <td className="action-buttons">
                <button onClick={() => handleEdit(item._id)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RetrieveData;
