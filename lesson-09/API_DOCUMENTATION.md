# API Documentation - Real Estate Management System

## Authentication
All protected endpoints require an `Authorization` header with format: `Bearer <token>`

---

## User APIs

### 1. Register Account
**Endpoint:** `POST /account`
- **Authentication:** Not required
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "CUSTOMER" // or "MANAGER", "EMPLOYEE"
  }
  ```

### 2. Login
**Endpoint:** `POST /login`
- **Authentication:** Not required
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** Token (use in Authorization header for protected endpoints)

---

## User Profile APIs

### 3. API 5: Get Personal Information According to Role
**Endpoint:** `GET /api/users/profile`
- **Authentication:** Required
- **Roles:** CUSTOMER, EMPLOYEE, MANAGER
- **Description:** Returns personal information based on user's role

### 4. API 6: Create Personal Information According to Role
**Endpoint:** `POST /api/users/profile`
- **Authentication:** Required
- **Roles:** CUSTOMER, EMPLOYEE, MANAGER
- **Body (for CUSTOMER):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St"
  }
  ```
- **Body (for EMPLOYEE/MANAGER):**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "department": "Sales"
  }
  ```

### 5. API 7: Manager Creates Employee
**Endpoint:** `POST /api/users/employee`
- **Authentication:** Required
- **Roles:** MANAGER only
- **Body:**
  ```json
  {
    "email": "employee@example.com",
    "password": "password123",
    "name": "Employee Name",
    "phone": "0123456789",
    "department": "Sales"
  }
  ```

### 6. API 15: Get All Employees Under Manager
**Endpoint:** `GET /api/users/employees`
- **Authentication:** Required
- **Roles:** MANAGER only
- **Description:** Returns list of all employees managed by the logged-in manager

---

## Property APIs

### 7. API 8: Create Property (with image)
**Endpoint:** `POST /api/properties`
- **Authentication:** Required
- **Roles:** MANAGER, EMPLOYEE
- **Content-Type:** multipart/form-data
- **Form Fields:**
  - `address` (string): Property address
  - `price` (number): Property price
  - `area` (number): Property area
  - `status` (string): "ONSALE", "SOLD", or "DISCONTINUED"
  - `image` (file): Property image
- **Description:** Creates new property and uploads image to Cloudinary

### 8. API 9: Update Property (with image)
**Endpoint:** `PUT /api/properties/:propertyId`
- **Authentication:** Required
- **Roles:** MANAGER, EMPLOYEE (employee can only update their own)
- **Content-Type:** multipart/form-data
- **Form Fields:**
  - `address` (string, optional): New property address
  - `price` (number, optional): New property price
  - `area` (number, optional): New property area
  - `status` (string, optional): New status
  - `image` (file, optional): New property image
- **Description:** Updates property information and/or replaces image

### 9. API 13: Get Employee's Properties
**Endpoint:** `GET /api/properties/my-properties`
- **Authentication:** Required
- **Roles:** EMPLOYEE only
- **Description:** Returns all properties managed by the logged-in employee

### 10. Get All Properties
**Endpoint:** `GET /api/properties`
- **Authentication:** Required
- **Description:** Returns all properties in the system

---

## Deposit Order APIs

### 11. API 10: Create Deposit Order
**Endpoint:** `POST /api/deposit-orders`
- **Authentication:** Required
- **Roles:** CUSTOMER only
- **Body:**
  ```json
  {
    "depositAmount": 50000000,
    "propertyId": "objectId_of_property"
  }
  ```
- **Description:** Customer creates a deposit order for a property

### 12. API 11: Get Deposit Orders With Customer Info (Staff)
**Endpoint:** `GET /api/deposit-orders/staff`
- **Authentication:** Required
- **Roles:** MANAGER, EMPLOYEE
- **Description:** Returns all deposit orders with customer information

### 13. API 12: Get Customer's Deposit Orders
**Endpoint:** `GET /api/deposit-orders/my-orders`
- **Authentication:** Required
- **Roles:** CUSTOMER only
- **Description:** Returns customer's deposit orders with property and employee information

### 14. API 14: Get All Deposit Orders (Manager)
**Endpoint:** `GET /api/deposit-orders/all`
- **Authentication:** Required
- **Roles:** MANAGER only
- **Description:** Returns all deposit orders in the system with customer information

---

## Usage Example

### 1. Register as Customer
```bash
curl -X POST http://localhost:8080/account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "pass123",
    "role": "CUSTOMER"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "pass123"
  }'
```

### 3. Create Personal Info
```bash
curl -X POST http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Main St"
  }'
```

### 4. Create Property (with image upload)
```bash
curl -X POST http://localhost:8080/api/properties \
  -H "Authorization: Bearer <manager_or_employee_token>" \
  -F "address=456 Oak Ave" \
  -F "price=500000000" \
  -F "area=100" \
  -F "status=ONSALE" \
  -F "image=@path/to/image.jpg"
```

---

## Response Format

### Success Response
```json
{
  "data": { /* response data */ },
  "message": "Success message",
  "isSuccess": true
}
```

### Error Response
```json
{
  "message": "Error message",
  "isSuccess": false
}
```

---

## Notes
- All timestamps are in ISO 8601 format
- Images are stored on Cloudinary
- Passwords are hashed using bcrypt
- JWT tokens expire in 1 day
- Employees must be created by their Manager
- Employees can only update their own properties
- Managers can create, view, and manage all resources under their authority
