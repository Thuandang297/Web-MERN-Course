# API Endpoints Testing Reference

## Summary of All Implemented APIs

| # | API | Method | Endpoint | Auth | Role(s) |
|---|-----|--------|----------|------|---------|
| 5 | Get Personal Info | GET | `/api/users/profile` | ✅ | CUSTOMER, EMPLOYEE, MANAGER |
| 6 | Create Personal Info | POST | `/api/users/profile` | ✅ | CUSTOMER, EMPLOYEE, MANAGER |
| 7 | Manager Creates Employee | POST | `/api/users/employee` | ✅ | MANAGER |
| 8 | Create Property | POST | `/api/properties` | ✅ | MANAGER, EMPLOYEE |
| 9 | Update Property | PUT | `/api/properties/:propertyId` | ✅ | MANAGER, EMPLOYEE |
| 10 | Create Deposit Order | POST | `/api/deposit-orders` | ✅ | CUSTOMER |
| 11 | Get Orders (Staff) | GET | `/api/deposit-orders/staff` | ✅ | MANAGER, EMPLOYEE |
| 12 | Get My Orders (Customer) | GET | `/api/deposit-orders/my-orders` | ✅ | CUSTOMER |
| 13 | Get My Properties | GET | `/api/properties/my-properties` | ✅ | EMPLOYEE |
| 14 | Get All Orders (Manager) | GET | `/api/deposit-orders/all` | ✅ | MANAGER |
| 15 | Get All Employees | GET | `/api/users/employees` | ✅ | MANAGER |

---

## Authentication APIs (Already Existing)

### Register Account
```
POST /account
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER"  // or "MANAGER", "EMPLOYEE"
}

Response (Success):
{
  "data": {
    "_id": "mongo_id",
    "email": "user@example.com",
    "password": "hashed_password",
    "isActive": true,
    "role": "CUSTOMER"
  },
  "message": "Account created!"
}
```

### Login
```
POST /login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login success!"
}
```

---

## API 5: Get Personal Information According to Role

```
GET /api/users/profile
Authorization: Bearer <token>

Response (CUSTOMER):
{
  "data": {
    "_id": "mongo_id",
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "accountId": "account_mongo_id"
  },
  "message": "Success",
  "isSuccess": true
}

Response (EMPLOYEE/MANAGER):
{
  "data": {
    "_id": "mongo_id",
    "name": "Jane Smith",
    "email": "employee@example.com",
    "phone": "0987654321",
    "department": "Sales",
    "accountId": "account_mongo_id",
    "managerId": "manager_mongo_id"  // (EMPLOYEE only)
  },
  "message": "Success",
  "isSuccess": true
}
```

---

## API 6: Create Personal Information According to Role

```
POST /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

Body (CUSTOMER):
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "address": "123 Main St"
}

Body (EMPLOYEE/MANAGER):
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "department": "Sales"
}

Response (Success - 201):
{
  "data": { /* personal info object */ },
  "message": "Personal info created successfully",
  "isSuccess": true
}

Response (Error - 400):
{
  "message": "Customer info already exists",
  "isSuccess": false
}
```

---

## API 7: Manager Creates Employee Account and Information

```
POST /api/users/employee
Authorization: Bearer <manager_token>
Content-Type: application/json

Body:
{
  "email": "newemp@example.com",
  "password": "emp_password",
  "name": "New Employee",
  "phone": "0111222333",
  "department": "Sales"
}

Response (Success - 201):
{
  "data": {
    "account": {
      "_id": "account_id",
      "email": "newemp@example.com",
      "password": "hashed",
      "isActive": true,
      "role": "EMPLOYEE"
    },
    "employee": {
      "_id": "employee_id",
      "name": "New Employee",
      "email": "newemp@example.com",
      "phone": "0111222333",
      "department": "Sales",
      "accountId": "account_id",
      "managerId": "manager_id"
    }
  },
  "message": "Employee created successfully",
  "isSuccess": true
}
```

---

## API 8: Create Property (with Image Upload)

```
POST /api/properties
Authorization: Bearer <employee_or_manager_token>
Content-Type: multipart/form-data

Form Data:
- address: (string) "456 Oak Avenue"
- price: (number) 500000000
- area: (number) 100
- status: (string) "ONSALE"  // optional, default: "ONSALE"
- image: (file) [image file]

Response (Success - 201):
{
  "data": {
    "_id": "property_id",
    "address": "456 Oak Avenue",
    "price": 500000000,
    "area": 100,
    "status": "ONSALE",
    "imageUrl": "https://res.cloudinary.com/...",
    "employeeId": "employee_id"
  },
  "message": "Property created successfully",
  "isSuccess": true
}
```

---

## API 9: Update Property (with Optional Image)

```
PUT /api/properties/:propertyId
Authorization: Bearer <employee_or_manager_token>
Content-Type: multipart/form-data

Form Data (all optional):
- address: (string) "New Address"
- price: (number) 600000000
- area: (number) 120
- status: (string) "SOLD"
- image: (file) [new image file]

Response (Success - 200):
{
  "data": {
    "_id": "property_id",
    "address": "New Address",
    "price": 600000000,
    "area": 120,
    "status": "SOLD",
    "imageUrl": "https://res.cloudinary.com/...",
    "employeeId": "employee_id"
  },
  "message": "Property updated successfully",
  "isSuccess": true
}
```

---

## API 10: Customer Creates Deposit Order

```
POST /api/deposit-orders
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "depositAmount": 50000000,
  "propertyId": "property_mongo_id"
}

Response (Success - 201):
{
  "data": {
    "_id": "deposit_order_id",
    "depositAmount": 50000000,
    "date": "2024-02-27T10:30:00.000Z",
    "status": "PENDING",
    "customerId": "customer_id",
    "propertyId": "property_id"
  },
  "message": "Deposit order created successfully",
  "isSuccess": true
}
```

---

## API 11: Get Deposit Orders with Customer Info (Staff)

```
GET /api/deposit-orders/staff
Authorization: Bearer <manager_or_employee_token>

Response (Success - 200):
{
  "data": [
    {
      "_id": "deposit_order_id",
      "depositAmount": 50000000,
      "date": "2024-02-27T10:30:00.000Z",
      "status": "PENDING",
      "customerId": {
        "_id": "customer_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "0123456789"
      },
      "propertyId": { /* full property object */ }
    }
  ],
  "message": "Success",
  "isSuccess": true
}
```

---

## API 12: Customer Views Own Deposit Orders

```
GET /api/deposit-orders/my-orders
Authorization: Bearer <customer_token>

Response (Success - 200):
{
  "data": [
    {
      "_id": "deposit_order_id",
      "depositAmount": 50000000,
      "date": "2024-02-27T10:30:00.000Z",
      "status": "PENDING",
      "customerId": "customer_id",
      "propertyId": {
        "_id": "property_id",
        "address": "456 Oak Avenue",
        "price": 500000000,
        "area": 100,
        "status": "ONSALE"
      },
      "employeeInfo": {
        "_id": "employee_id",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "0987654321"
      }
    }
  ],
  "message": "Success",
  "isSuccess": true
}
```

---

## API 13: Employee Views Their Properties

```
GET /api/properties/my-properties
Authorization: Bearer <employee_token>

Response (Success - 200):
{
  "data": [
    {
      "_id": "property_id",
      "address": "456 Oak Avenue",
      "price": 500000000,
      "area": 100,
      "status": "ONSALE",
      "imageUrl": "https://res.cloudinary.com/...",
      "employeeId": "employee_id"
    }
  ],
  "message": "Success",
  "isSuccess": true
}
```

---

## API 14: Manager Views All Deposit Orders

```
GET /api/deposit-orders/all
Authorization: Bearer <manager_token>

Response (Success - 200):
{
  "data": [
    {
      "_id": "deposit_order_id",
      "depositAmount": 50000000,
      "date": "2024-02-27T10:30:00.000Z",
      "status": "PENDING",
      "customerId": {
        "_id": "customer_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "0123456789"
      },
      "propertyId": { /* full property object */ }
    }
  ],
  "message": "Success",
  "isSuccess": true
}
```

---

## API 15: Manager Views All Employees

```
GET /api/users/employees
Authorization: Bearer <manager_token>

Response (Success - 200):
{
  "data": [
    {
      "_id": "employee_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "0987654321",
      "department": "Sales",
      "accountId": "account_id",
      "managerId": "manager_id"
    }
  ],
  "message": "Success",
  "isSuccess": true
}
```

---

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "message": "Token not found",
  "isSuccess": false
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
  "message": "Access denied",
  "isSuccess": false
}
```

### 404 Not Found
```json
{
  "message": "Personal info not found",
  "isSuccess": false
}
```

### 500 Server Error
```json
{
  "message": "Error message details",
  "isSuccess": false
}
```

---

## Notes for Testing

- All tokens expire in 24 hours
- Use the same token format for all authenticated requests: `Authorization: Bearer <token>`
- Cloudinary images are permanently uploaded and publicly accessible
- Employee can only update properties they created
- Manager can update any property
- Customer information must be created before placing deposit orders
- Each account can have only one personal information record per role
