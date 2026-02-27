import bcrypt from 'bcrypt';
import AccountModel from '../models/accounts.js';
import CustomerModel from '../models/customers.js';
import EmployeeModel from '../models/employees.js';
import ManagerModel from '../models/managers.js';

// API 5: Get personal information according to role
export const getPersonalInfo = async (req, res) => {
    try {
        const { accountId, role } = req.user;

        let personalInfo;

        if (role === 'CUSTOMER') {
            personalInfo = await CustomerModel.findOne({ accountId });
        } else if (role === 'EMPLOYEE') {
            personalInfo = await EmployeeModel.findOne({ accountId });
        } else if (role === 'MANAGER') {
            personalInfo = await ManagerModel.findOne({ accountId });
        }

        if (!personalInfo) {
            return res.status(404).send({ message: 'Personal info not found', isSuccess: false });
        }

        res.send({ data: personalInfo, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 6: Create personal information according to role
export const createPersonalInfo = async (req, res) => {
    try {
        const { accountId, role } = req.user;
        const { name, email, phone, address, department } = req.body;

        let personalInfo;

        if (role === 'CUSTOMER') {
            // Check if customer info already exists
            const existingCustomer = await CustomerModel.findOne({ accountId });
            if (existingCustomer) {
                return res.status(400).send({ message: 'Customer info already exists', isSuccess: false });
            }

            personalInfo = await CustomerModel.create({
                name,
                email,
                phone,
                address,
                accountId
            });
        } else if (role === 'EMPLOYEE') {
            // Check if employee info already exists
            const existingEmployee = await EmployeeModel.findOne({ accountId });
            if (existingEmployee) {
                return res.status(400).send({ message: 'Employee info already exists', isSuccess: false });
            }

            personalInfo = await EmployeeModel.create({
                name,
                email,
                phone,
                department,
                accountId
            });
        } else if (role === 'MANAGER') {
            // Check if manager info already exists
            const existingManager = await ManagerModel.findOne({ accountId });
            if (existingManager) {
                return res.status(400).send({ message: 'Manager info already exists', isSuccess: false });
            }

            personalInfo = await ManagerModel.create({
                name,
                email,
                phone,
                department,
                accountId
            });
        }

        res.status(201).send({ data: personalInfo, message: 'Personal info created successfully', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 7: Manager creates account and information for Employee
export const createEmployeeByManager = async (req, res) => {
    try {
        const { accountId, role } = req.user;
        
        // Check if user is manager
        if (role !== 'MANAGER') {
            return res.status(403).send({ message: 'Only manager can create employee', isSuccess: false });
        }

        const { email, password, name, phone, department } = req.body;

        // Check if account already exists
        const existingAccount = await AccountModel.findOne({ email });
        if (existingAccount) {
            return res.status(400).send({ message: 'Account already exists', isSuccess: false });
        }

        // Create account
        const salt = bcrypt.genSaltSync(5);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newAccount = await AccountModel.create({
            email,
            password: hashPassword,
            isActive: true,
            role: 'EMPLOYEE'
        });

        // Get manager info
        const manager = await ManagerModel.findOne({ accountId });

        // Create employee info
        const newEmployee = await EmployeeModel.create({
            name,
            email,
            phone,
            department,
            accountId: newAccount._id,
            managerId: manager._id
        });

        res.status(201).send({ 
            data: { account: newAccount, employee: newEmployee }, 
            message: 'Employee created successfully', 
            isSuccess: true 
        });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 15: Manager gets personal information of all employees under their management
export const getEmployeesUnderManager = async (req, res) => {
    try {
        const { accountId, role } = req.user;

        if (role !== 'MANAGER') {
            return res.status(403).send({ message: 'Only manager can access this', isSuccess: false });
        }

        const manager = await ManagerModel.findOne({ accountId });

        if (!manager) {
            return res.status(404).send({ message: 'Manager info not found', isSuccess: false });
        }

        const employees = await EmployeeModel.find({ managerId: manager._id });

        res.send({ data: employees, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};
