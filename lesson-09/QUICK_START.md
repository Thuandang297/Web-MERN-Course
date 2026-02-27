# Quick Start Guide 🚀

## Installation & Setup

### 1. Install Dependencies
```bash
cd lesson-09
npm install
```

### 2. Start Server
```bash
# Development mode (with nodemon)
npm run dev

# Or normal mode
node index.js
```

The server will run on: `http://localhost:8080`

---

## Testing with Postman/cURL

### Step 1: Create Accounts

**Manager Account:**
```bash
curl -X POST http://localhost:8080/account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@test.com",
    "password": "manager123",
    "role": "MANAGER"
  }'
```

**Employee Account:**
```bash
curl -X POST http://localhost:8080/account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@test.com",
    "password": "emp123",
    "role": "EMPLOYEE"
  }'
```

**Customer Account:**
```bash
curl -X POST http://localhost:8080/account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "cust123",
    "role": "CUSTOMER"
  }'
```

### Step 2: Login & Get Tokens

**Manager Login:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@test.com",
    "password": "manager123"
  }'
```

Save the token from response: `"data": "your_token_here"`

**Employee Login & Customer Login:** (same format, different credentials)

### Step 3: Create Personal Profiles

**Manager Creates Profile:**
```bash
curl -X POST http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager Name",
    "email": "manager@test.com",
    "phone": "0123456789",
    "department": "Management"
  }'
```

**Employee Creates Profile:**
```bash
curl -X POST http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Name",
    "email": "employee@test.com",
    "phone": "0987654321",
    "department": "Sales"
  }'
```

**Customer Creates Profile:**
```bash
curl -X POST http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Name",
    "email": "customer@test.com",
    "phone": "0111222333",
    "address": "123 Main Street"
  }'
```

### Step 4: Employee Creates Property (with Image)

```bash
curl -X POST http://localhost:8080/api/properties \
  -H "Authorization: Bearer YOUR_EMPLOYEE_TOKEN" \
  -F "address=456 Oak Avenue" \
  -F "price=500000000" \
  -F "area=100" \
  -F "status=ONSALE" \
  -F "image=@/path/to/image.jpg"
```

**Response will include:**
```json
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

Save the `_id` for next step.

### Step 5: Customer Creates Deposit Order

```bash
curl -X POST http://localhost:8080/api/deposit-orders \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "depositAmount": 50000000,
    "propertyId": "PROPERTY_ID_FROM_STEP_4"
  }'
```

### Step 6: Verify Data Retrieval

**Customer Views Their Orders:**
```bash
curl -X GET http://localhost:8080/api/deposit-orders/my-orders \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN"
```

**Employee Views Their Properties:**
```bash
curl -X GET http://localhost:8080/api/properties/my-properties \
  -H "Authorization: Bearer YOUR_EMPLOYEE_TOKEN"
```

**Manager Views All Employees:**
```bash
curl -X GET http://localhost:8080/api/users/employees \
  -H "Authorization: Bearer YOUR_MANAGER_TOKEN"
```

**Manager Views All Orders:**
```bash
curl -X GET http://localhost:8080/api/deposit-orders/all \
  -H "Authorization: Bearer YOUR_MANAGER_TOKEN"
```

---

## API Endpoints Summary

### User APIs
- `GET /api/users/profile` - Get personal info
- `POST /api/users/profile` - Create personal info
- `POST /api/users/employee` - Manager creates employee
- `GET /api/users/employees` - Manager views all employees

### Property APIs
- `POST /api/properties` - Create property with image
- `PUT /api/properties/:id` - Update property
- `GET /api/properties` - Get all properties
- `GET /api/properties/my-properties` - Employee views owned properties

### Deposit Order APIs
- `POST /api/deposit-orders` - Create deposit order
- `GET /api/deposit-orders/my-orders` - Customer views own orders
- `GET /api/deposit-orders/staff` - Staff view orders with customer info
- `GET /api/deposit-orders/all` - Manager views all orders

### Authentication APIs
- `POST /account` - Register account
- `POST /login` - Login and get token

---

## Common Issues & Solutions

### Issue: "Token not found"
**Solution:** Make sure you include the Authorization header:
```
Authorization: Bearer <your_token>
```

### Issue: "Access denied"
**Solution:** Check your user role matches the endpoint requirements. For example:
- `/api/users/employee` requires MANAGER role
- `/api/deposit-orders/all` requires MANAGER role

### Issue: Image not uploading
**Solution:** 
- Make sure you use `-F` flag for multipart/form-data
- Check file path is correct
- Cloudinary credentials should be active

### Issue: "Property not found"
**Solution:** Make sure you're using the correct `propertyId` from the creation response

### Issue: "Personal info not found"
**Solution:** Make sure you've created your profile first:
```
POST /api/users/profile
```

---

## Documentation Files

- **API_DOCUMENTATION.md** - Full API documentation
- **API_TESTING_REFERENCE.md** - Request/response examples
- **IMPLEMENTATION_SUMMARY.md** - What was implemented
- **COMPLETE_GUIDE.md** - System architecture & workflows

---

## Testing Checklist

- [ ] All 3 account types created (Manager, Employee, Customer)
- [ ] All profiles created
- [ ] Manager created a new employee successfully
- [ ] Employee created a property with image
- [ ] Image URL is visible in property response
- [ ] Customer created a deposit order
- [ ] Customer can view their orders with property & employee details
- [ ] Employee can view their properties
- [ ] Manager can view all employees
- [ ] Manager can view all deposit orders

---

## Next Steps

1. Test all endpoints with Postman collection (create one)
2. Add custom validations for input
3. Add more error handling
4. Move credentials to .env file
5. Deploy to production
6. Add frontend application

Happy coding! 🎉
