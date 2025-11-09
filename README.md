Multi-Vendor Inventory & Order System (MERN Stack)

A clean and simple multi-vendor online shopping web application built using the MERN stack (MongoDB, Express.js, React, Node.js).

This project enables two types of users:

Users – Browse products, place orders, and track their order status.

Vendors – Add, edit, and manage their products and handle customer orders.

When a user places an order, the vendor can mark it as completed or cancelled.
The system automatically updates product stock in real time to ensure accurate inventory management.

🚀 Quick Start (Clone → Run)
1️⃣ Clone the Repository
git clone <YOUR_GITHUB_REPO_URL>
cd myshop

2️⃣ Setup & Start Backend
cd server
cp .env.example .env   # Create environment file
npm install
npm run dev            # For development (nodemon)
# or
npm start              # For production

3️⃣ Seed Sample Data
node seed/seed.js


Seeds 3 vendors and 10 products.

4️⃣ Setup & Start Frontend

Open a new terminal:

cd ../client
cp .env.example .env   # Create environment file
npm install
npm run dev

5️⃣ Open the App

Frontend: http://localhost:5173

Backend API: http://localhost:5000/api

🔑 Seeded Vendor Accounts

You can log in using the following vendor accounts (password for all = password123):

Vendor Name	Email
Alpha Shop	alpha@shop.com

Beta Store	beta@shop.com

Cosmic Mart	cosmic@shop.com
🗂️ Project Structure
myshop/
├── server/                     # Node/Express Backend
│   ├── models/                 # Mongoose models (User, Product, Order)
│   ├── routes/                 # Routes for auth, products, orders, vendors
│   ├── middleware/             # Auth middleware (JWT, role-based)
│   ├── seed/seed.js            # Seeder script
│   ├── server.js               # Backend entry point
│   ├── package.json
│   ├── .env.example            # Backend environment template
│   └── README-backend.md       # (Optional)
│
└── client/                     # React (Vite) Frontend
    ├── src/                    # Components and pages
    ├── vite.config.js
    ├── package.json
    ├── .env.example            # Frontend environment template
    └── README-frontend.md      # (Optional)

⚙️ Requirements

Node.js: ≥ 18

npm: ≥ 9

MongoDB: Local or Atlas connection

Available Ports: 5000 (Backend) & 5173 (Frontend)

🌍 Environment Variables
server/.env.example
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/myshop
JWT_SECRET=super_secret_change_me
CLIENT_ORIGIN=http://localhost:5173


⚠️ Ensure CLIENT_ORIGIN matches your frontend URL.

client/.env.example
VITE_API_BASE=http://localhost:5000/api

🧩 Available Scripts
Backend (Server)
Command	Description
npm run dev	Start API with hot reload (nodemon)
npm start	Start API without nodemon
node seed/seed.js	Seed database with sample data
Frontend (Client)
Command	Description
npm run dev	Start Vite development server
npm run build	Build production version
npm run preview	Preview production build locally
🧭 How to Use (Step-by-Step)
👤 User Flow

Register a new account and select the role: User.

Browse products and place an order.

View order status under My Orders (auto-updates when vendor takes action).

🏪 Vendor Flow

Log in or register as a Vendor.

Go to Vendor Dashboard → Manage your Products (Add/Edit/Delete).

Handle Orders → Mark as Fulfilled or Cancelled.

Cancelling automatically restocks the product.

🧠 API Overview (High-Level)

Base URL: http://localhost:5000/api

🔐 Auth (Cookie-Based)
Method	Endpoint	Description
POST	/auth/register	Register new user or vendor
POST	/auth/login	Login user/vendor
POST	/auth/logout	Logout
GET	/auth/me	Get current user info
🛍️ Products
Method	Endpoint	Description
GET	/products	Get all products
GET	/products/stock?ids=<id,id,...>	Get real-time stock info
📦 Orders (User)
Method	Endpoint	Description
POST	/orders	Place an order
GET	/orders/me	View your orders
🧾 Vendor
Method	Endpoint	Description
GET	/vendor/me/products	View vendor’s products
POST	/vendor/me/products	Add new product
PATCH	/vendor/me/products/:id	Edit product
DELETE	/vendor/me/products/:id	Delete product
GET	/vendor/me/orders	View vendor’s orders
PATCH	/vendor/me/orders/:id	Update order status (fulfilled/cancelled)

⚠️ Note: No Authorization header required — JWT is stored securely in an httpOnly cookie.

✅ Verifying the Setup

Register & Login → Cookie appears in browser (not accessible via JS).

View seeded products → Stocks auto-update in real-time.

Place order → Status updates correctly.

Vendor accounts can manage products & update orders.

🧰 Troubleshooting
❌ Unauthenticated After Login

Ensure:

Axios includes withCredentials: true

Backend CORS allows credentials: true and correct origin.

⚠️ CORS Errors

Update CLIENT_ORIGIN in .env.

Ensure CORS config matches frontend URL.

🧩 MongoDB Connection Fails

Verify MongoDB is running.

Check MONGO_URI in .env.

🔒 Cookies Over HTTPS

Set secure=true and sameSite=none for production over HTTPS.

Tech Stack

Frontend: React + Vite + Axios

Backend: Node.js + Express.js + JWT Auth

Database: MongoDB (Mongoose ORM)

Authentication: Cookie-based JWT

Deployment: Vercel (frontend), Render/Railway (backend)
