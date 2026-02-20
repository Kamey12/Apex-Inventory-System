# Apex Inventory System

**A premium inventory management and Point of Sale (POS) application for small shops built with the MERN stack.**  
It features real-time dashboards, role-based access control, and secure authentication flows.

---

## 🌟 Key Features

### Role-Based Access Control (RBAC)
- **Admin:** Full access to user management, financial reports, inventory, and dashboards.  
- **Staff:** Read-only inventory access with POS operations.

### Enterprise Point of Sale (POS)
- Multi-item shopping cart system.  
- Automatic stock deduction with backend validation to prevent overselling.  
- Supports atomic bulk transactions for data integrity.

### Real-Time Telemetry Dashboard
- 7-day revenue trends (Area charts)  
- Asset allocation by category (Doughnut charts)  
- Inventory health & low-stock alerts (Bar charts)  

### Cryptographic Security
- JWT-based authentication & session management.  
- Bcrypt password hashing.  
- Secure token-based password reset using Node's `crypto` module.

### Premium User Interface
- Responsive layout with a fixed sidebar.  
- Icon-driven design using **Lucide-React**.  
- Cohesive "Corporate Trust" light theme powered by CSS variables.

---

## 🛠️ Tech Stack

**Frontend**  
- React (Vite)  
- React Router DOM  
- Context API (state management)  
- Recharts (charts & visualizations)  
- Lucide-React (icons)  
- React-Toastify (notifications)  
- CSS Grid & Flexbox (styling)

**Backend**  
- Node.js & Express.js  
- MongoDB (Mongoose ODM)  
- JWT & Bcrypt for authentication  
- Node Crypto for secure password flows

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/apex-inventory-system.git
cd apex-inventory-system
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Install Dependencies
**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 4. Run the Application
Open two terminals:

**Backend:**
```bash
cd backend
npm run start
```

**Frontend:**
```bash
cd client
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)  
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure
```text
apex-inventory-system/
├── backend/
│   ├── config/         # DB connection logic
│   ├── middleware/     # JWT & admin verification
│   ├── models/         # User, Product, Transaction schemas
│   ├── routes/         # Auth & product routes
│   └── server.js       # Express entry point
└── client/
    ├── src/
    │   ├── context/    # Global AuthContext
    │   ├── pages/      # Dashboard, Inventory, POS, Users, Reports
    │   ├── App.jsx     # Router & sidebar layout
    │   ├── index.css   # Design system & variables
    │   └── main.jsx    # React DOM render
    ├── package.json
    └── vite.config.js
```

---

## 🔒 Security Architecture
- **API Protection:** All critical routes are protected by `protect` middleware. Admin-only operations require `isAdmin` middleware.  
- **Data Sanitization:** Passwords are never returned to clients. User lists filter out sensitive fields.  
- **State Synchronization:** Frontend securely stores JWT in localStorage and attaches it to Axios requests.  
- **Atomic Transactions:** POS sales validate stock before deduction to maintain data integrity.

---

## 💡 License
MIT © [Abdul Karim Hasan](https://github.com/Kamey12)

