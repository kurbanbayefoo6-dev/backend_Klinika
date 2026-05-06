# 🏥 Klinika Management System - Backend

Modern clinic management system API backend (Node.js + Express + PostgreSQL + JWT)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL
- npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run server
npm start
```

Server ishga tushadi: `http://localhost:3000`

Bir xil WiFi'dagi boshqa noutbookdan API'ga kirish uchun host kompyuterning lokal IP manzilidan foydalaning, masalan: `http://192.168.1.25:3000/api/auth/login`. Server hozir `0.0.0.0` ga bound qilingan, shuning uchun LAN orqali ochiq bo'ladi.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Database pool configuration
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── utils/
│   │   └── auth.ts            # JWT & password utilities
│   ├── middlewares/
│   │   └── auth.ts            # Authorization middleware
│   ├── controllers/
│   │   └── authController.ts  # Auth logic
│   ├── routes/
│   │   └── auth.ts            # Auth routes
│   └── index.ts               # Database test file
├── server.ts                   # Main server entry
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
├── .env.example                # Environment template
├── FRONTEND_ENDPOINTS.md       # Frontend API docs
├── FRONTEND_API_SERVICE.js     # Ready-to-use JS service
├── Klinika_API.postman_collection.json  # Postman collection
└── README.md                   # This file
```

---

## 🔐 Authentication System

### Login Flow

```
1. POST /api/auth/login
   → Send username + password
   → Get JWT token
   → Save token in localStorage

2. Use token for protected routes
   → Add "Authorization: Bearer {token}" header

3. Server verifies token
   → If valid → Access granted
   → If expired → Return 401
```

### JWT Config

- **Secret**: `supersecret` (change in production!)
- **Expiry**: `10 hours`
- **Algorithm**: HS256

---

## 📊 API Documentation

### Quick Links

- **Frontend Docs**: [FRONTEND_ENDPOINTS.md](./FRONTEND_ENDPOINTS.md)
- **Postman Collection**: [Klinika_API.postman_collection.json](./Klinika_API.postman_collection.json)
- **Auth API**: [AUTH_API.md](./AUTH_API.md)

### Main Endpoints

| Method | Endpoint            | Auth | Description                          |
| ------ | ------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/login`   | ❌   | Login with username, password & role |
| GET    | `/api/auth/profile` | ✅   | Get current user profile             |
| GET    | `/health`           | ❌   | Health check                         |
| GET    | `/db`               | ❌   | Database status                      |

---

## 🧪 Test Credentials

```
Doctor:   username: doctor1     password: password123
Admin:    username: admin1      password: admin123
Cashier:  username: cashier1    password: cashier123
```

### Quick Test

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor1","password":"password123"}'

# Get token from response and use it:
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Dev Tools**: ts-node, nodemon
- **Environment**: dotenv

---

## 🔧 Configuration

### .env File

```env
# Database
DB_HOST=dpg-xxx.postgres.render.com
DB_PORT=5432
DB_NAME=db_klinik
DB_USER=clinic
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=10h

# Server
PORT=3000
```

---

## 🗄️ Database Schema

### Users (Combined from multiple tables)

```sql
-- DOCTOR
CREATE TABLE DOCTOR (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(20),
  role VARCHAR(20),
  profile_img_url BYTEA
);

-- ADMIN
CREATE TABLE ADMIN (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20)
);

-- CASHIER
CREATE TABLE CASHIER (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20)
);
```

---

## 🔄 Frontend Integration

### Using the API Service

Copy `FRONTEND_API_SERVICE.js` to your frontend project:

```javascript
import { login, getProfile, isAuthenticated } from './services/authService'

// Login (role select bilan)
const result = await login('doctor1', 'password123', 'doctor')
if (result.success) {
	console.log('Logged in!', result.data)
}

// Check authentication
if (isAuthenticated()) {
	const user = getCurrentUser()
	console.log('Current user:', user)
}

// Get profile (protected)
const profile = await getProfile()
console.log('Profile:', profile.data)
```

### Using Fetch Directly

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ username: 'doctor1', password: 'password123' }),
})

const data = await response.json()
localStorage.setItem('auth_token', data.token)
```

---

## 📝 Scripts

```bash
# Start server (with auto-reload)
npm start

# Run database connection test
npx ts-node src/index.ts

# Dev mode (with nodemon)
npm run dev
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3000   # Windows
```

### Database Connection Error

- Check `.env` credentials
- Ensure database is running
- Test with: `GET http://localhost:3000/db`

### Token Expired

- Token expiry: 10 hours
- After expiry, user must login again
- Frontend should redirect to login page on 401 response

### CORS Issues

Add this to `server.ts` if needed:

```javascript
import cors from 'cors'
app.use(cors())
```

---

## 🚢 Production Deployment

### Before Deploying:

1. **Change JWT Secret**

   ```env
   JWT_SECRET=generate-very-long-random-string-here
   ```

2. **Use Secure Database Connection**
   - Use SSL/TLS for PostgreSQL

3. **Environment Variables**
   - Use different `.env` for production
   - Never commit secrets to git

4. **HTTPS**
   - Deploy with HTTPS
   - Update API URLs in frontend

5. **CORS Configuration**
   ```javascript
   const corsOptions = {
   	origin: 'https://your-frontend-domain.com',
   	credentials: true,
   }
   app.use(cors(corsOptions))
   ```

---

## 📞 Support & Documentation

- Frontend Docs: See [FRONTEND_ENDPOINTS.md](./FRONTEND_ENDPOINTS.md)
- Postman Collection: Import [Klinika_API.postman_collection.json](./Klinika_API.postman_collection.json)
- API Playground: Visit `http://localhost:3000/` for basic endpoints

---

## 📄 License

MIT

---

**Last Updated**: May 4, 2026
**Version**: 1.0.0
**Author**: Development Team
