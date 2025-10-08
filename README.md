# Password Generator & Vault

A secure and easy-to-use **Password Generator and Vault** app built with **Next.js**, **Node.js**, and **MongoDB**.  
Generate strong passwords, save them securely, and manage them (search, edit, delete) in your personal vault.

---

## 🔗 Live Demo
[Live Demo URL](YOUR_LIVE_DEMO_URL_HERE)

## 📂 Repository
[GitHub Repo](YOUR_REPO_LINK_HERE)

---

## 🛠 Tech Stack
- **Frontend:** Next.js  
- **Backend / API:** Node.js / Express  
- **Database:** MongoDB  
- **Encryption:** Node.js `crypto` module  

> **Why crypto?**  
> We used Node.js `crypto` module to encrypt passwords before storing them, keeping sensitive data safe and retrievable.

---

## 🚀 Full Setup Guide (Frontend + Backend)

```bash
# Step 1: Clone the repository
git clone YOUR_REPO_LINK_HERE
cd REPO_FOLDER_NAME

# =========================
# Step 2: Frontend Setup
# =========================
cd frontend
npm install

# Run frontend in a separate terminal
npm run dev

# =========================
# Step 3: Backend Setup
# =========================
cd ../backend
npm install

# Create environment file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=5000" >> .env
echo "ENCRYPTION_KEY=your_secret_key" >> .env

# Start backend server
npm run start   # or node index.js
