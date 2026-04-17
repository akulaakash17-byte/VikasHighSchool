# 🏫 Vikas High School — Website v2.0

Full-stack school website with public frontend, admin panel, JWT auth, and PostgreSQL backend.

---

## 📁 Project Structure

```
vikas-school/
├── public/
│   ├── index.html          ← Main school website (public)
│   └── admin/
│       └── index.html      ← Admin dashboard (JWT protected)
├── routes/
│   ├── auth.js             ← Login endpoint
│   ├── announcements.js    ← Public GET / Protected POST & DELETE
│   └── enquiries.js        ← Public POST / Protected GET & DELETE
├── middleware/
│   └── auth.js             ← JWT verification middleware
├── db.js                   ← PostgreSQL pool (uses .env)
├── server.js               ← Express app entry point
├── setup-admin.js          ← Run ONCE to create admin account
├── .env                    ← Secret config (never commit this)
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create PostgreSQL Tables
Run this SQL in your PostgreSQL database (`psql` or pgAdmin):

```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  password TEXT
);

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    parent_name TEXT,
    phone TEXT,
    student_name TEXT,
    class TEXT,
    email TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configure .env
Your `.env` is already set up with:
- DB credentials (postgres / Lucky_@#10)
- JWT secret
- Port 3000

### 4. Create Admin Account
Edit `setup-admin.js` and set your desired password, then:
```bash
node setup-admin.js
```
**Delete `setup-admin.js` after running it!**

### 5. Start the Server
```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| School Website | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin |

---

## 🔐 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/announcements` | Get all announcements |
| POST | `/api/enquiries` | Submit enquiry (from website) |

### Protected (requires `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/announcements` | Add announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |
| GET | `/api/enquiries` | Get all enquiries (paginated) |
| DELETE | `/api/enquiries/:id` | Delete enquiry  |

---

## ✅ Security Improvements (v2.0)
- ✅ `.env` for all secrets (no hardcoded passwords)
- ✅ JWT-based admin authentication (8-hour sessions)
- ✅ All admin API routes protected by `requireAuth` middleware
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Parameterized SQL queries (prevents SQL injection)
- ✅ Input validation and sanitization
- ✅ 404 and error handling

---

## 🚀 Production Notes
- Set a strong `JWT_SECRET` in `.env`
- Use HTTPS (SSL certificate)
- Change default admin password
- Consider rate limiting (`express-rate-limit`)
- Delete `setup-admin.js` after use