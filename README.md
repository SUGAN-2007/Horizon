# 🛍️ Horizon — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with **React + Vite** on the frontend and **Express.js** on the backend, powered by **Supabase** for authentication and database, and **Brevo** for transactional email notifications.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Email Notifications](#email-notifications)
- [Admin Panel](#admin-panel)
- [Production Deployment](#production-deployment)
- [License](#license)

---

## Overview

**Horizon** is a full-stack clothing e-commerce platform with customer-facing shopping features and a role-gated admin dashboard, built on React, Express.js, and Supabase.

---

## ✨ Features

### Customer-Facing
- 🔐 **Authentication** — Sign up, login, password reset via Supabase Auth
- 🛒 **Cart** — Add/remove items, update quantities, persistent cart per user
- 🏷️ **Product Browsing** — Browse by category, search, view product details with size selection
- 📦 **Checkout** — Address entry, payment method selection, order placement
- 📬 **Order Tracking** — Real-time order status updates (Pending → Packing → Out for Delivery → Delivered)
- ⭐ **Reviews & Replies** — Rate and review products, reply to existing reviews
- 👤 **Profile** — View and update personal details, address, and order history
- 🔔 **Email Notifications** — Order confirmation, status update, and welcome emails

### Admin Panel (`/Admin`)
- 📊 **Dashboard Stats** — Overview of orders, revenue, and product counts
- 📦 **Order Management** — View all orders, update statuses, trigger email alerts
- 🏪 **Product Management** — Upload, edit, and delete products
- 💸 **Discounts** — Create and manage promotional discounts
- 🗒️ **Review Moderation** — View and manage customer reviews

---

## 🛠️ Tech Stack

| Layer        | Technology                                         |
|--------------|----------------------------------------------------|
| Frontend     | React 19, React Router DOM 7, Vite 7               |
| Styling      | Vanilla CSS                                        |
| Backend      | Express.js 5, Node.js (ES Modules)                 |
| Database     | Supabase (PostgreSQL)                              |
| Auth         | Supabase Auth                                      |
| Email        | Brevo API (transactional emails)                   |
| Security     | Helmet, CORS, JWT via Supabase                     |
| Deployment   | Vercel (frontend), any Node host (backend)         |

---

## 📁 Project Structure

```
E-com/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── App.jsx              # Root component & routing
│   │   ├── main.jsx             # Entry point
│   │   ├── Components/          # Reusable UI components
│   │   │   ├── Nav.jsx          # Navigation bar with cart icon
│   │   │   ├── CartSidebar.jsx  # Slide-out cart panel
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── Login.jsx        # Auth modal
│   │   │   ├── ProductGrid.jsx  # Product listing grid
│   │   │   ├── OrderTracker.jsx # Order status tracker
│   │   │   ├── Search.jsx       # Product search bar
│   │   │   ├── Notifications.jsx# User notifications
│   │   │   ├── Skeleton.jsx     # Loading placeholder
│   │   │   └── ...
│   │   ├── Pages/               # Route-level page components
│   │   │   ├── Home.jsx         # Landing / homepage
│   │   │   ├── Shop.jsx         # All products listing
│   │   │   ├── Description.jsx  # Product detail page
│   │   │   ├── Checkout.jsx     # Order checkout
│   │   │   ├── Profile.jsx      # User profile & orders
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   ├── AuthPage.jsx     # Auth (login/signup)
│   │   │   ├── ResetPassword.jsx# Password reset
│   │   │   ├── Notfound.jsx     # 404 page
│   │   │   └── Admin/           # Admin-only pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminStats.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminDiscounts.jsx
│   │   │       ├── AdminReviews.jsx
│   │   │       └── ProductUpload.jsx
│   │   ├── context/             # React Context (user state, cart)
│   │   ├── lib/                 # Supabase client
│   │   ├── content/             # Static content / data
│   │   └── css/                 # Global stylesheets
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── vercel.json              # Vercel deployment config
│
├── backend/                     # Express.js REST API
│   ├── server.js                # App entry point
│   ├── supabaseClient.js        # Supabase admin client
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── products.js          # Product CRUD
│   │   ├── cart.js              # Cart management
│   │   ├── orders.js            # Order placement & tracking
│   │   └── reviews.js           # Reviews & replies
│   ├── middleware/
│   │   └── verifyuser.js        # JWT auth middleware
│   ├── utils/
│   │   └── mailer.js            # Brevo email helpers
│   ├── db.sql                   # Database schema reference
│   └── package.json
│
└── .gitignore
```

---

## 🗄️ Database Schema

The database is hosted on **Supabase (PostgreSQL)** and contains the following tables:

| Table            | Description                                              |
|------------------|----------------------------------------------------------|
| `profiles`       | Extended user info (name, phone, address, role)         |
| `products`       | Product catalog (title, price, image, sizes, rating)    |
| `cart`           | Per-user cart items (product, size, quantity)           |
| `orders`         | Order records (total, status, address, payment method)  |
| `order_items`    | Line items per order (product, size, quantity, price)   |
| `reviews`        | Product ratings and comments                            |
| `review_replies` | Threaded replies to reviews                             |

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### Auth — `/api/auth`
| Method | Path              | Description                                      |
|--------|-------------------|--------------------------------------------------|
| POST   | `/auth/welcome`   | Send a welcome email to a newly registered user  |

> **Note:** Login, signup, password reset, and session management are handled **client-side** via the Supabase JS SDK and do not go through this Express server.

### Products — `/api/products`
| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | `/products`       | List all products        |
| POST   | `/products`       | Create a product (admin) |
| PUT    | `/products/:id`   | Update a product (admin) |
| DELETE | `/products/:id`   | Delete a product (admin) |

### Cart — `/api/cart`
| Method | Path        | Description                     |
|--------|-------------|---------------------------------|
| GET    | `/cart`     | Get user's cart items           |
| POST   | `/cart`     | Add item to cart                |
| PUT    | `/cart/:id` | Update cart item quantity       |
| DELETE | `/cart/:id` | Remove item from cart           |

### Orders — `/api/orders`
| Method | Path            | Description                      |
|--------|-----------------|----------------------------------|
| GET    | `/orders`       | Get user's orders (or all — admin)|
| POST   | `/orders`       | Place a new order                |
| PUT    | `/orders/:id`   | Update order status (admin)      |

### Reviews — `/api/reviews`
| Method | Path                      | Description                 |
|--------|---------------------------|-----------------------------|
| GET    | `/reviews/:productId`     | Get reviews for a product   |
| POST   | `/reviews`                | Submit a review             |
| DELETE | `/reviews/:id`            | Delete a review (admin)     |
| POST   | `/reviews/:id/replies`    | Reply to a review           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **Supabase** project with the schema from `backend/db.sql`
- A **Brevo** account for transactional emails

---

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create your .env file (see Environment Variables section)
# Then start the development server
npm run dev
```

The backend runs on the port specified in `.env` (default: `5000`).

---

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create your .env file (see Environment Variables section)
# Then start the development server
npm run dev
```

The frontend dev server runs at `http://localhost:5173` by default.

---

## 🔑 Environment Variables

### `backend/.env`

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
```

### `frontend/.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` files. They are already listed in `.gitignore`.

---

## 📧 Email Notifications

Powered by the **Brevo API** (`utils/mailer.js`), the following transactional emails are sent automatically:

| Trigger                    | Recipient      | Email Content                             |
|----------------------------|----------------|-------------------------------------------|
| New order placed           | Customer       | Order receipt with items, total, and GST  |
| New order placed           | Admin          | Alert with order ID and customer email    |
| Order status updated       | Customer       | New status notification                   |
| New product / discount     | Customer       | Product or discount announcement          |
| New user signup            | Customer       | Welcome email                             |

---

## 🔐 Admin Panel

The admin panel is accessible at `/Admin` and is **restricted to users with `role = 'admin'`** in the `profiles` table.

To grant admin access, update the user's role in Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-uuid';
```

Admin features include:
- Viewing platform statistics
- Managing all orders and updating statuses
- Uploading and editing products
- Managing promotions and discounts
- Moderating product reviews

---

## 🚢 Production Deployment

### Frontend (Vercel)

```bash
cd frontend

# Build the production bundle
npm run build

# Preview the build locally before deploying
npm run preview
```

The `dist/` folder is what gets deployed. The included `vercel.json` configures SPA fallback routing so that React Router paths like `/Shop` work on hard refresh.

Make sure your **Vercel project environment variables** mirror `frontend/.env` — set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_BACKEND_URL` (pointing to your live backend URL) in the Vercel dashboard.

### Backend (Any Node Host — Railway, Render, Fly.io, etc.)

```bash
cd backend

# Production start (no file watching)
npm start
```

Key production environment differences vs. development:

| Variable         | Development                   | Production                        |
|------------------|-------------------------------|-----------------------------------|
| `PORT`           | `5000`                        | Assigned by host (e.g. `8080`)    |
| `FRONTEND_URL`   | `http://localhost:5173`       | Your live Vercel URL              |
| `NODE_ENV`       | *(unset)*                     | `production`                      |

> ⚠️ Set all environment variables as **host-level secrets**, never in a committed file.

---

## 📄 License

This project is released under the **MIT License** — see the [LICENSE](./LICENSE) file for full terms.

```
MIT License

Copyright (c) 2026 Horizon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```
