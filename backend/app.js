const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB Connection
const uri =
  "mongodb+srv://Gowtham_Reddy:Gowtham2004@cluster0.q5mzsyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log("Connection lost", err));

// AES-256-CBC Encryption
const ALGORITHM = "aes-256-cbc";
const KEY = crypto.createHash("sha256").update("your-very-secret-key").digest(); 
const IV = Buffer.alloc(16, 0); 


function encrypt(text) {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
}

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const vaultEntrySchema = new mongoose.Schema({
  email: { type: String, required: true },
  websitename: { type: String, required: true },
  url: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const VaultEntry = mongoose.model("VaultEntry", vaultEntrySchema);

// Root
app.get("/", (req, res) => {
  res.send(`Hey there, I am running on ${port}`);
});

// Register
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "User login success", email: existingUser.email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Vault Entry
app.post("/api/mainpassword", async (req, res) => {
  try {
    const { email, url, password, websitename } = req.body;
    const encryptedPassword = password ? encrypt(password) : "";

    await new VaultEntry({ email, url, websitename, password: encryptedPassword }).save();
    res.json({ message: "Data added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Vault Entries
app.post("/api/allpasswords", async (req, res) => {
  try {
    const { email } = req.body;
    const vaultData = await VaultEntry.find({ email });

    const decryptedData = vaultData.map((entry) => ({
      _id: entry._id,
      email: entry.email,
      url: entry.url,
      websitename: entry.websitename,
      password: decrypt(entry.password),
    }));

    res.json({ data: decryptedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// Delete Vault Entry
app.delete("/api/deletepassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await VaultEntry.findByIdAndDelete(id);
    res.json({ message: "Password entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting entry" });
  }
});


app.put("/api/updatepassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const encryptedPassword = password ? encrypt(password) : "";

    await VaultEntry.findByIdAndUpdate(id, { password: encryptedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating entry" });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
