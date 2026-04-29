# 🏋️ GYM PLUS — Management System

A full-stack Gym Management System with a modern SaaS-style dark-sidebar dashboard.

---

## 📁 Project Structure

```
gym-management/
├── backend/
│   ├── server.js          # Express API server
│   ├── .env               # DB credentials
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/    # Sidebar, Header, Card, Modal, Layout
│   │   ├── pages/         # All 10 pages
│   │   └── services/      # api.js (Axios)
│   └── package.json
└── schema.sql             # MySQL database schema + seed data
```

---

## ⚙️ Prerequisites

- Node.js v16+
- MySQL 8.0+ (MySQL Workbench)
- npm

---

## 🗄️ Step 1 — Database Setup

1. Open **MySQL Workbench**
2. Connect with: host=`localhost`, user=`root`, password=`Josh@1234`
3. Open a new SQL tab and run the entire `schema.sql` file
4. This creates the `gym_plus` database with all tables and seed data

---

## 🔧 Step 2 — Backend Setup

```bash
cd gym-management/backend
npm install
npm start
```

Backend runs at: **http://localhost:5000**

To verify: visit http://localhost:5000/dashboard in your browser

---

## 🎨 Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd gym-management/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

> The frontend proxies API calls to `http://localhost:5000` automatically.

---

## 🔐 Login Credentials

| Role    | Username   | Password     |
|---------|------------|--------------|
| Admin   | `admin`    | `admin123`   |
| Trainer | `trainer1` | `trainer123` |

---

## 🚀 Features

| Page                | Description                                          |
|---------------------|------------------------------------------------------|
| 📊 Dashboard        | Stats cards, donut chart, recent members, banner     |
| 👤 Members          | Full CRUD with search/filter, avatar, status badges  |
| 💳 Memberships      | Plan cards, editable membership table                |
| ➕ Add Membership   | 3-column form with auto date calculation             |
| 🧾 Payments         | Payment records with summary cards                   |
| 🧠 Biometric Intake | Fingerprint + face simulation, entry/exit marking    |
| 🏋️ Trainers        | Card grid + table, full CRUD                         |
| 📅 Attendance       | Live attendance log with duration                    |

---

## 🔗 API Endpoints

```
POST   /login
GET    /dashboard
GET    /members
POST   /add-member
PUT    /update-member/:id
DELETE /delete-member/:id
GET    /memberships
POST   /add-membership
PUT    /update-membership/:id
DELETE /delete-membership/:id
GET    /trainers
POST   /add-trainer
PUT    /update-trainer/:id
DELETE /delete-trainer/:id
GET    /attendance
GET    /member-lookup/:id
POST   /entry
POST   /exit
GET    /payments
POST   /add-payment
```

---

## 🛠️ Troubleshooting

**MySQL connection error:**
- Check MySQL is running
- Verify password in `backend/.env` matches your MySQL root password
- Default password is set to `Josh@1234`

**CORS error in browser:**
- Ensure backend is running on port 5000
- Frontend must be on port 3000

**Port conflict:**
- Change `PORT=5000` in `backend/.env`
- Update `"proxy"` in `frontend/package.json` to match
