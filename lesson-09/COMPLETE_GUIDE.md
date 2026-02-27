# Real Estate Management System - Complete Implementation Guide

## 🎯 Project Overview

This is a comprehensive Real Estate Management System API built with Node.js, Express, MongoDB, and Cloudinary. It implements a complete role-based access control system for managing properties, customers, employees, and deposit orders.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Express Server (8080)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │      Authentication Layer                    │  │
│  │  - Account Registration & Login              │  │
│  │  - JWT Token Generation & Verification        │  │
│  │  - Role-Based Access Control                  │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌───────────┬──────────────┬──────────────────┐   │
│  │   Users   │  Properties  │ Deposit Orders   │   │
│  │  Router   │   Router     │    Router        │   │
│  └───────────┴──────────────┴──────────────────┘   │
│      ↓            ↓                  ↓             │
│  Controllers & Database Operations                │
└─────────────────────────────────────────────────────┘
         ↓              ↓              ↓
    MongoDB        Cloudinary      JWT Secret
    Database        Storage         (test-token-2026)
```

---

## 🗂️ Project Structure

```
lesson-09/
│
├── index.js                          # Main server file
├── package.json                      # Dependencies
├── API_DOCUMENTATION.md              # Detailed API docs
├── IMPLEMENTATION_SUMMARY.md         # Implementation summary
├── API_TESTING_REFERENCE.md         # Testing guide
│
└── src/
    ├── models/                       # Data Models
    │   ├── accounts.js               # Account (email, password, role)
    │   ├── customers.js              # Customer (name, phone, address)
    │   ├── employees.js              # Employee (name, department, manager)
    │   ├── managers.js               # Manager (name, department)
    │   ├── properties.js             # Property (address, price, image)
    │   ├── depositOder.js            # DepositOrder (amount, status)
    │   ├── author.js                 # (existing)
    │   └── books.js                  # (existing)
    │
    ├── middlewares/
    │   └── auth.js                   # Authentication & Role middleware
    │
    ├── controller/                   # Business Logic
    │   ├── userController.js         # APIs 5, 6, 7, 15
    │   ├── propertyController.js     # APIs 8, 9, 13
    │   └── depositOrderController.js # APIs 10, 11, 12, 14
    │
    └── router/                       # Route Handlers
        ├── userRouter.js             # User routes
        ├── propertyRouter.js         # Property routes
        └── depositOrderRouter.js     # Deposit order routes
```

---

## 👥 User Roles & Permissions

### CUSTOMER (Khách hàng)
- ✅ Create personal profile
- ✅ View personal profile
- ✅ Create deposit orders
- ✅ View own deposit orders (with property & employee info)
- ❌ Cannot manage properties
- ❌ Cannot manage other users

### EMPLOYEE (Nhân viên)
- ✅ Create personal profile
- ✅ View personal profile
- ✅ Create properties
- ✅ Update own properties
- ✅ View own properties
- ✅ View deposit orders (for their properties)
- ❌ Cannot create other employees
- ❌ Cannot create manager accounts

### MANAGER (Quản lý)
- ✅ Create personal profile
- ✅ View personal profile
- ✅ Create/manage employees
- ✅ View all employees
- ✅ Create properties
- ✅ Update any property
- ✅ View all properties
- ✅ View all deposit orders
- ✅ Full system access

---

## 🔐 Authentication Flow

```
1. User Registration (POST /account)
   Email + Password + Role
        ↓
   Password Hashing (bcrypt)
        ↓
   Save Account to MongoDB
        ↓
   Return Account Object

2. Login (POST /login)
   Email + Password
        ↓
   Fetch Account by Email
        ↓
   Compare Password (bcrypt.compareSync)
        ↓
   Check if Account Active
        ↓
   Generate JWT Token
        ↓
   Return Token

3. Protected Request
   Include Header: Authorization: Bearer <token>
        ↓
   authMiddleware validates JWT
        ↓
   Extract user info (accountId, role)
        ↓
   Attach to req.user
        ↓
   roleMiddleware checks user role
        ↓
   Proceed or deny based on role
```

---

## 📚 Data Models & Relationships

### Account Model
```javascript
{
  email: String,           // Unique user email
  password: String,        // Hashed password
  isActive: Boolean,       // Account status
  role: Enum[CUSTOMER, EMPLOYEE, MANAGER]
}
```

### Customer Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  accountId: Reference → Account  // Links to account
}
```

### Employee Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  department: String,
  accountId: Reference → Account,    // Links to account
  managerId: Reference → Manager      // Reports to manager
}
```

### Manager Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  department: String,
  accountId: Reference → Account
}
```

### Property Model
```javascript
{
  address: String,
  price: Number,
  area: Number,
  status: Enum[ONSALE, SOLD, DISCONTINUED],
  imageUrl: String,         // Cloudinary URL
  employeeId: Reference → Employee  // Managed by employee
}
```

### DepositOrder Model
```javascript
{
  depositAmount: Number,
  date: Date,
  status: Enum[PENDING, PAID, CANCELLED],
  customerId: Reference → Customer,
  propertyId: Reference → Property
}
```

---

## 🚀 API Workflow Examples

### Scenario 1: Employee Creates Property Listing

```
1. Employee registers account
   POST /account → {email, password, role: "EMPLOYEE"}

2. Employee logs in
   POST /login → {email, password} → returns JWT token

3. Employee creates personal info
   POST /api/users/profile → {name, phone, department}

4. Employee creates property with image
   POST /api/properties → 
   {address, price, area, status, image file}
   
   ↓ Server processes:
   - Uploads image to Cloudinary
   - Stores URL in database
   - Associates property with employee

5. Response includes property with imageUrl
```

### Scenario 2: Customer Places Deposit Order

```
1. Customer registers
   POST /account → {email, password, role: "CUSTOMER"}

2. Customer logs in
   POST /login → returns JWT token

3. Customer creates profile
   POST /api/users/profile → {name, phone, address}

4. Customer views available properties
   GET /api/properties (public access, auth required)

5. Customer creates deposit order
   POST /api/deposit-orders →
   {depositAmount, propertyId}
   
   ↓ Creates order with:
   - Status: "PENDING"
   - Current date/time
   - Links customer and property

6. Customer retrieves order details
   GET /api/deposit-orders/my-orders →
   
   ↓ Response includes:
   - Order details
   - Property info (address, price, area)
   - Employee handling sale (name, email, phone)
```

### Scenario 3: Manager Oversees Operations

```
1. Manager registers
   POST /account → {email, password, role: "MANAGER"}

2. Manager logs in
   POST /login → returns JWT token

3. Manager creates personal profile
   POST /api/users/profile → {name, phone, department}

4. Manager creates new employees
   POST /api/users/employee →
   {email, password, name, phone, department}
   
   ↓ Server:
   - Creates Account with role: "EMPLOYEE"
   - Creates Employee profile
   - Links employee to manager

5. Manager views all employees
   GET /api/users/employees → returns list

6. Manager monitors all deposit orders
   GET /api/deposit-orders/all →
   
   ↓ Response includes:
   - All orders
   - Customer details
   - Property details
   - Associated employees

7. Manager can update/manage properties
   PUT /api/properties/:propertyId →
   {address, price, area, status, image}
```

---

## 📋 API Implementation Checklist

- [x] API 5: Get personal information by role
- [x] API 6: Create personal information by role
- [x] API 7: Manager creates employee accounts
- [x] API 8: Create property with image upload
- [x] API 9: Update property with optional image
- [x] API 10: Customer creates deposit order
- [x] API 11: Get orders with customer info (staff view)
- [x] API 12: Customer views own orders with property & employee
- [x] API 13: Employee views managed properties
- [x] API 14: Manager views all system orders
- [x] API 15: Manager views all employees

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Web Framework | Express.js |
| Database | MongoDB (Atlas) |
| Authentication | JWT (JsonWebToken) |
| Password Hashing | bcrypt |
| Image Storage | Cloudinary |
| File Upload | Multer |
| Server Port | 8080 |
| Environment | Development (nodemon) |

---

## 📦 Key Dependencies

```json
{
  "bcrypt": "^6.0.0",           // Password hashing
  "cloudinary": "^2.9.0",       // Image storage
  "dotenv": "^17.2.4",          // Environment variables
  "express": "^5.2.1",          // Web framework
  "jsonwebtoken": "^9.0.3",     // JWT tokens
  "mongoose": "^9.1.6",         // MongoDB ODM
  "multer": "^2.0.2"            // File upload handler
}
```

---

## 🔄 Request/Response Flow

### Successful Request
```
Client Request
    ↓
Express Router
    ↓
authMiddleware (Validates JWT)
    ↓
roleMiddleware (Checks user role)
    ↓
Controller Function
    ↓
Database Operations
    ↓
Cloudinary Upload (if needed)
    ↓
Format Response
    ↓
HTTP 200/201 Response
```

### Error Request
```
Client Request
    ↓
Express Router
    ↓
authMiddleware (Invalid token)
    ↓
401 Unauthorized Response
```

---

## 💾 Network Architecture

```
┌──────────────┐
│   Client     │
│ (Postman/   │
│  Frontend)  │
└──────┬───────┘
       │ HTTPS
       ↓
┌──────────────────────────────┐
│   Express Server             │
│   (localhost:8080)           │
│                              │
│  Routes & Middleware         │
│  ↓ Controllers ↓             │
└──────┬───────────┬───────────┘
       │           │
       ↓ TCP       ↓ HTTP
┌─────────────┐  ┌────────────────┐
│  MongoDB    │  │  Cloudinary    │
│  (Atlas)    │  │  (Image CDN)   │
└─────────────┘  └────────────────┘
```

---

## 🧪 Quick Testing Steps

1. **Register Three Accounts**
   - 1 Manager account
   - 1 Employee account
   - 1 Customer account

2. **Setup Profiles**
   - Each user creates their personal info

3. **Manager Creates Employee**
   - Manager can create additional employees

4. **Employee Creates Property**
   - With image upload to Cloudinary

5. **Customer Places Order**
   - Creates deposit order for property

6. **Verify Data Retrieval**
   - Each role can access appropriate data

---

## 📝 Response Format Standards

All API responses follow this structure:

**Success Response (200):**
```json
{
  "data": { /* response data */ },
  "message": "Success message",
  "isSuccess": true
}
```

**Error Response (4xx/5xx):**
```json
{
  "message": "Error description",
  "isSuccess": false
}
```

**Created Response (201):**
```json
{
  "data": { /* created object */ },
  "message": "Resource created successfully",
  "isSuccess": true
}
```

---

## 🔒 Security Features Implemented

- ✅ Password hashing (bcrypt, 5 rounds)
- ✅ JWT token authentication (24-hour expiry)
- ✅ Role-based access control (3 roles)
- ✅ Protected API endpoints
- ✅ Account active status checking
- ✅ Employee-property ownership validation
- ✅ Secure image hosting (Cloudinary)

---

## ⚠️ Important Notes

1. **JWT Token Secret:** `'test-token-2026'` (should use environment variable)
2. **Cloudinary Credentials:** In index.js (should move to .env)
3. **MongoDB Connection:** Atlas cloud (should use .env)
4. **Token Expiry:** 24 hours per token
5. **Employee Creation:** Can only be done by managers
6. **Property Updates:** Employees can only update their own
7. **Image Upload:** Used only in property creation/update

---

## 🚀 Next Improvements

1. Move credentials to .env file
2. Add input validation (joi/yup)
3. Add API rate limiting
4. Add comprehensive error handling
5. Add request logging
6. Add automated testing (Jest)
7. Add CORS configuration
8. Add deposit order status update APIs
9. Add property search/filter APIs
10. Add email notifications

---

## 📞 Support & Documentation

- **API_DOCUMENTATION.md** - Detailed endpoint documentation
- **API_TESTING_REFERENCE.md** - Complete testing guide with examples
- **IMPLEMENTATION_SUMMARY.md** - Implementation details and structure
- **This file** - Architecture and workflow explanation
