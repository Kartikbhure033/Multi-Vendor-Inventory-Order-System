# Multi-Vendor-Inventory-Order-SystemA clean,This project is a simple online shopping web application built using the MERN stack (MongoDB, Express, React, Node). There are two types of users: regular users who can browse products and place orders, and vendors who can add and manage products. When a user places an order, the vendor can mark it as completed or cancel it. The system also updates product stock automatically to keep everything accurate.

This README is written so anyone can clone from GitHub and run it end‑to‑end in minutes on macOS/Windows/Linux.

1) Quick Start (Clone → Run)
# 1) Clone the repo
git clone <YOUR_GITHUB_REPO_URL> 
cd myshop


# 2) Start backend
cd server
cp .env.example .env   # create env file from example
npm i
npm run dev            # or: npm start


# 3) Seed sample data (3 vendors, 10 products)
node seed/seed.js


# 4) Start frontend (in a new terminal)
cd ../client
cp .env.example .env   # create env file from example
npm i
npm run dev


# 5) Open the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api

Seeded vendor logins (password for all = password123):

alpha@shop.com

beta@shop.com

cosmic@shop.com

2) Project Structure
myshop/
├─ server/                      # Node/Express API
│  ├─ models/                   # Mongoose models (User, Product, Order)
│  ├─ routes/                   # auth, products, orders, vendor
│  ├─ middleware/               # auth (JWT), roles
│  ├─ seed/seed.js              # seeder script
│  ├─ server.js                 # app entry
│  ├─ package.json
│  ├─ .env.example              # backend env template
│  └─ README-backend.md (opt)
└─ client/                      # React (Vite)
   ├─ src/                      # components/pages
   ├─ vite.config.js
   ├─ package.json
   ├─ .env.example              # frontend env template
   └─ README-frontend.md (opt)
3) Requirements

Node.js >= 18 and npm >= 9 (or yarn/pnpm)

MongoDB running locally or MongoDB Atlas connection string

Ports 5000 (API) and 5173 (Vite) available

4) Environment Variables
server/.env.example
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/myshop
JWT_SECRET=super_secret_change_me
CLIENT_ORIGIN=http://localhost:5173

CLIENT_ORIGIN must match your frontend URL.

In dev, cookies are set with httpOnly, sameSite=lax, secure=false (see code). In production use secure=true & sameSite=none over HTTPS.

client/.env.example
VITE_API_BASE=http://localhost:5000/api

After copying .env.example to .env, adjust values as needed.

5) Scripts
Backend (server)

npm run dev – Start API with nodemon (hot reload)

npm start – Start API without nodemon

node seed/seed.js – Seed database (3 vendors, 10 products)

Frontend (client)

npm run dev – Start Vite dev server

npm run build – Production build

npm run preview – Preview the build locally

6) How to Use (Happy Path)

Register a new account (choose role: user or vendor). You’ll be logged in automatically (JWT httpOnly cookie).

User flow

Visit Products → choose a product → Place Order (stock checked, vendor self‑buy prevented).

Check My Orders for status. (Vendor actions update it.)

Vendor flow

Vendor Dashboard → Products: Create/Edit/Delete products.

Vendor Dashboard → Orders: See new orders → Fulfill or Cancel. Cancelling auto‑restocks product.

7) API (High‑level)

Base URL: http://localhost:5000/api

Auth (cookie‑based)

POST /auth/register { name, email, password, role: "user"|"vendor" }

POST /auth/login { email, password }

POST /auth/logout

GET /auth/me

Public Products

GET /products

GET /products/stock?ids=<id,id,...> → real‑time stock map

Orders (user)

POST /orders { productId, quantity }

GET /orders/me

Vendor

GET /vendor/me/products

POST /vendor/me/products

PATCH /vendor/me/products/:id

DELETE /vendor/me/products/:id

GET /vendor/me/orders

PATCH /vendor/me/orders/:id { status: "fulfilled" | "cancelled" }

No Authorization header required: the JWT is stored in an httpOnly cookie.

8) Verifying the Setup

Open http://localhost:5173 and ensure you can:

Register & login (cookie appears in the browser, not visible to JS).

See seeded products; polling keeps stock fresh.

Place an order as a user; view it in My Orders.

Switch to a seeded vendor account; manage products & update order statuses.

9) Troubleshooting

Unauthenticated after login

Ensure frontend Axios uses withCredentials: true and backend CORS has credentials: true and the correct origin.

CORS errors

Update CLIENT_ORIGIN in server/.env and the cors({ origin, credentials }) config to match UI URL.

Mongo connection fails

Check that MongoDB is running and MONGO_URI is correct.

Cookies in HTTPS

Use secure=true and sameSite=none in production with TLS; ensure frontend and backend are on trusted origins.

10) Production Deployment (Brief)

Backend: Deploy to Render/Railway/EC2; set env vars; allow your frontend origin via CORS; enable secure cookies.

Frontend: Build with npm run build and deploy the dist/ folder to Vercel/Netlify/Static host. Set VITE_API_BASE to the deployed API URL.

MongoDB: Use MongoDB Atlas and set MONGO_URI accordingly.
