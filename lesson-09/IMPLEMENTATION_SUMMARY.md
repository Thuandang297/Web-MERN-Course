# API Implementation Summary

## Completed APIs (Yêu cầu 5-15)

### ✅ API 5: Get Personal Information According to Role
- **Endpoint:** `GET /api/users/profile`
- **Authentication:** Required (Bearer Token)
- **Roles:** CUSTOMER, EMPLOYEE, MANAGER
- **Description:** Returns personal information corresponding to user's role

### ✅ API 6: Create Personal Information According to Role
- **Endpoint:** `POST /api/users/profile`
- **Authentication:** Required (Bearer Token)
- **Roles:** CUSTOMER, EMPLOYEE, MANAGER
- **Description:** Logged-in user creates their personal information based on their role

### ✅ API 7: Manager Creates Employee Account and Information
- **Endpoint:** `POST /api/users/employee`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER only
- **Description:** Manager creates account and information for Employee
- **Features:** 
  - Auto-assigns employee to manager
  - Creates both Account and Employee records

### ✅ API 8: Create Property Information (with Images)
- **Endpoint:** `POST /api/properties`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER, EMPLOYEE
- **Description:** Create property with image upload to Cloudinary
- **Features:**
  - Image upload support
  - Associates property with employee
  - Default status: "ONSALE"

### ✅ API 9: Update Property Information (with Images)
- **Endpoint:** `PUT /api/properties/:propertyId`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER, EMPLOYEE
- **Description:** Update property information and/or image
- **Features:**
  - Employee can only update their own properties
  - Manager can update any property
  - Optional image update

### ✅ API 10: Customer Creates Deposit Order
- **Endpoint:** `POST /api/deposit-orders`
- **Authentication:** Required (Bearer Token)
- **Roles:** CUSTOMER only
- **Description:** Customer creates deposit order for a property
- **Features:**
  - Auto-sets status to "PENDING"
  - Records deposit date

### ✅ API 11: Manager/Employee Get Deposit Orders with Customer Info
- **Endpoint:** `GET /api/deposit-orders/staff`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER, EMPLOYEE
- **Description:** View all deposit orders with customer information (name, email, phone)

### ✅ API 12: Customer Sees Own Deposit Orders with Property and Employee Info
- **Endpoint:** `GET /api/deposit-orders/my-orders`
- **Authentication:** Required (Bearer Token)
- **Roles:** CUSTOMER only
- **Description:** Customer views their deposit orders with:
  - Property details (address, price, area, status)
  - Employee information (name, email, phone)

### ✅ API 13: Employee Views Properties They Manage
- **Endpoint:** `GET /api/properties/my-properties`
- **Authentication:** Required (Bearer Token)
- **Roles:** EMPLOYEE only
- **Description:** Lists all properties assigned to the employee

### ✅ API 14: Manager Views All Deposit Orders in System
- **Endpoint:** `GET /api/deposit-orders/all`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER only
- **Description:** Manager views all deposit orders with customer information

### ✅ API 15: Manager Gets Personal Info of All Employees
- **Endpoint:** `GET /api/users/employees`
- **Authentication:** Required (Bearer Token)
- **Roles:** MANAGER only
- **Description:** Manager views personal information of all employees under their management

---

## File Structure

```
lesson-09/
├── index.js (main server file - updated with routers)
├── package.json
├── API_DOCUMENTATION.md
├── IMPLEMENTATION_SUMMARY.md (this file)
└── src/
    ├── models/
    │   ├── accounts.js (Account schema - role based)
    │   ├── customers.js (Customer personal info)
    │   ├── employees.js (Employee info - linked to manager)
    │   ├── managers.js (Manager info)
    │   ├── properties.js (Property info - UPDATED with imageUrl field)
    │   ├── depositOder.js (Deposit order schema)
    │   ├── author.js
    │   └── books.js
    ├── middlewares/
    │   └── auth.js (Authentication & role-based middleware)
    ├── controller/
    │   ├── userController.js (APIs 5, 6, 7, 15)
    │   ├── propertyController.js (APIs 8, 9, 13)
    │   └── depositOrderController.js (APIs 10, 11, 12, 14)
    └── router/
        ├── userRouter.js
        ├── propertyRouter.js
        └── depositOrderRouter.js
```

---

## Key Features Implemented

### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Role-based access control (MANAGER, EMPLOYEE, CUSTOMER)
- ✅ Token verification middleware
- ✅ Role-specific endpoint access

### User Management
- ✅ Account creation with password hashing (bcrypt)
- ✅ Login with token generation
- ✅ Personal information management per role
- ✅ Manager can create employees
- ✅ Manager can view all employees

### Property Management
- ✅ Create properties with image upload (Cloudinary)
- ✅ Update properties with optional image replacement
- ✅ Image hosting on Cloudinary
- ✅ Employee can manage their own properties
- ✅ Manager can manage all properties
- ✅ Property status tracking (ONSALE, SOLD, DISCONTINUED)

### Deposit Orders
- ✅ Customer creates deposit orders
- ✅ Deposit order status tracking (PENDING, PAID, CANCELLED)
- ✅ View orders with related information (customer, property, employee)
- ✅ Role-based access to order information
- ✅ Date tracking for deposit orders

### Data Models
- ✅ Account (email, password, role, active status)
- ✅ Customer (name, email, phone, address)
- ✅ Employee (name, email, phone, department, manager reference)
- ✅ Manager (name, email, phone, department)
- ✅ Property (address, price, area, status, image, employee reference)
- ✅ DepositOrder (amount, date, status, customer, property references)

---

## Testing Guide

### 1. Register Accounts
```bash
# Register Manager
POST /account
{
  "email": "manager@test.com",
  "password": "pass123",
  "role": "MANAGER"
}

# Register Employee
POST /account
{
  "email": "employee@test.com",
  "password": "pass123",
  "role": "EMPLOYEE"
}

# Register Customer
POST /account
{
  "email": "customer@test.com",
  "password": "pass123",
  "role": "CUSTOMER"
}
```

### 2. Login and Get Token
```bash
POST /login
{
  "email": "manager@test.com",
  "password": "pass123"
}
# Response: {"data": "token...", "message": "Login success!"}
```

### 3. Create Personal Information
```bash
# Manager creates profile
POST /api/users/profile
Headers: Authorization: Bearer <token>
{
  "name": "Manager Name",
  "email": "manager@test.com",
  "phone": "0123456789",
  "department": "Management"
}
```

### 4. Manager Creates Employee
```bash
POST /api/users/employee
Headers: Authorization: Bearer <manager_token>
{
  "email": "new_emp@test.com",
  "password": "emp_pass",
  "name": "Employee Full Name",
  "phone": "0987654321",
  "department": "Sales"
}
```

### 5. Employee Creates Property with Image
```bash
POST /api/properties
Headers: Authorization: Bearer <employee_token>
Content-Type: multipart/form-data
Fields:
  - address: "123 Main Street"
  - price: 500000000
  - area: 100
  - status: "ONSALE"
  - image: [file]
```

### 6. Customer Creates Deposit Order
```bash
POST /api/deposit-orders
Headers: Authorization: Bearer <customer_token>
{
  "depositAmount": 50000000,
  "propertyId": "property_id_from_database"
}
```

### 7. Customer Views Their Orders
```bash
GET /api/deposit-orders/my-orders
Headers: Authorization: Bearer <customer_token>
```

### 8. Employee Views Their Properties
```bash
GET /api/properties/my-properties
Headers: Authorization: Bearer <employee_token>
```

### 9. Manager Views All Deposit Orders
```bash
GET /api/deposit-orders/all
Headers: Authorization: Bearer <manager_token>
```

### 10. Manager Views All Employees
```bash
GET /api/users/employees
Headers: Authorization: Bearer <manager_token>
```

---

## Environment Requirements

- **Node.js:** v18+ (recommended)
- **MongoDB:** Cloud Atlas or local instance
- **Cloudinary:** Account for image hosting
- **Dependencies:** See package.json

## Running the Server

```bash
# Install dependencies
npm install

# Run with nodemon (development)
npm run dev

# Run normally
node index.js
```

Server runs on: `http://localhost:8080`

---

## Security Notes

- ⚠️ Passwords are hashed with bcrypt (5 salt rounds)
- ⚠️ JWT tokens expire in 1 day
- ⚠️ All sensitive endpoints require authentication
- ⚠️ Role-based access control enforced on all APIs
- ⚠️ Employee can only modify their own properties
- ⚠️ Cloudinary credentials should be moved to environment variables

---

## Next Steps for Production

1. Move credentials to `.env` file
2. Add input validation (joi/yup)
3. Add error handling middleware
4. Add logging system
5. Add rate limiting
6. Add CORS configuration
7. Add database transaction support
8. Add email notifications
9. Add deposit order status update APIs
10. Add property search/filter APIs
