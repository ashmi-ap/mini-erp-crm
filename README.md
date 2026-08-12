# Mini ERP CRM — Operations Hub

A modern, responsive **Mini ERP + CRM web application** designed to provide a centralized operational workspace for managing customers, products, inventory, and challans.

The project is built as a full-stack application with a React-based frontend and a separate backend API. The current frontend provides the main ERP workspace, authentication flow, dashboard, and dedicated modules for customers, products, inventory, and challans.

---

## 🚀 Features

### 📊 Dashboard

The dashboard provides a centralized overview of business operations.

- Active customers
- Low-stock products
- Draft challans
- Confirmed challans
- Today's operational statistics
- Inventory alerts
- Customer follow-up indicators
- Quick navigation to major ERP modules

---

### 👥 Customer Management

The Customers module is designed for managing customer-related information.

Planned/implemented functionality includes:

- Customer listing
- Customer search
- Customer filtering
- Customer information
- Follow-up tracking
- Customer activity timeline

---

### 📦 Product Management

The Products module provides a workspace for managing the product catalog.

Features include:

- Product catalog
- Product information
- Pricing
- Stock information
- Warehouse-related information
- Product management interface

---

### 🏭 Inventory Management

The Inventory module provides a centralized view of stock operations.

Features include:

- Stock overview
- Low-stock identification
- Stock movement tracking
- Inventory adjustments
- Product stock information

---

### 🧾 Challan Management

The Challans module is designed to handle the challan workflow.

The system supports the concept of:

- Draft challans
- Confirmed challans
- Challan status
- Challan workflow
- Challan-related operational actions

---

### 🔐 Authentication

The application includes an authentication flow with:

- Login page
- Protected routes
- Authentication context
- Auth-aware application components
- Protected ERP workspace

Users who are not authenticated are redirected to the login page.

---

## 🖥️ UI / Design

The application uses a modern dark ERP dashboard design.

### Design characteristics

- Dark professional interface
- Responsive layout
- Sidebar navigation
- Dashboard cards
- Operational status indicators
- Responsive desktop/mobile layout
- Consistent typography
- Component-based React architecture

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS

### Backend

- Node.js
- TypeScript
- REST API
- Prisma
- Database

### Development Tools

- VS Code
- Git
- GitHub
- npm
- Vite

---

## 📁 Project Structure

```text
mini-erp-crm/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/
│       ├── src/
│       │   │
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   ├── AppShell.tsx
│       │   │   ├── ProtectedRoute.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── TopHeader.tsx
│       │   │
│       │   ├── lib/
│       │   │   └── AuthContext.tsx
│       │   │
│       │   ├── pages/
│       │   │   ├── LoginPage.tsx
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── CustomersPage.tsx
│       │   │   ├── ProductsPage.tsx
│       │   │   ├── InventoryPage.tsx
│       │   │   ├── ChallansPage.tsx
│       │   │   └── PlaceholderPage.tsx
│       │   │
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── styles.css
│       │
│       ├── public/
│       ├── .env
│       ├── .env.example
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── package.json
├── tsconfig.base.json
├── .gitignore
└── README.md
