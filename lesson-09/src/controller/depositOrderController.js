import DepositModel from '../models/depositOder.js';
import CustomerModel from '../models/customers.js';
import PropertiesModel from '../models/properties.js';
import EmployeeModel from '../models/employees.js';
import ManagerModel from '../models/managers.js';

// API 10: Customer creates a deposit order
export const createDepositOrder = async (req, res) => {
    try {
        const { accountId, role } = req.user;

        if (role !== 'CUSTOMER') {
            return res.status(403).send({ message: 'Only customer can create deposit order', isSuccess: false });
        }

        const { depositAmount, propertyId } = req.body;

        // Get customer info
        const customer = await CustomerModel.findOne({ accountId });

        if (!customer) {
            return res.status(404).send({ message: 'Customer info not found', isSuccess: false });
        }

        // Check if property exists
        const property = await PropertiesModel.findById(propertyId);

        if (!property) {
            return res.status(404).send({ message: 'Property not found', isSuccess: false });
        }

        const newDepositOrder = await DepositModel.create({
            depositAmount,
            date: new Date(),
            status: 'PENDING',
            customerId: customer._id,
            propertyId
        });

        res.status(201).send({ 
            data: newDepositOrder, 
            message: 'Deposit order created successfully', 
            isSuccess: true 
        });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 11: Manager or Employee gets deposit orders with customer information
export const getDepositOrdersWithCustomerInfo = async (req, res) => {
    try {
        const { role } = req.user;

        if (!['MANAGER', 'EMPLOYEE'].includes(role)) {
            return res.status(403).send({ message: 'Only manager or employee can access this', isSuccess: false });
        }

        const depositOrders = await DepositModel.find()
            .populate({
                path: 'customerId',
                select: 'name email phone'
            })
            .populate('propertyId');

        res.send({ data: depositOrders, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 12: Customer views their own deposit orders with Property and Employee information
export const getCustomerDepositOrders = async (req, res) => {
    try {
        const { accountId, role } = req.user;

        if (role !== 'CUSTOMER') {
            return res.status(403).send({ message: 'Only customer can access this', isSuccess: false });
        }

        const customer = await CustomerModel.findOne({ accountId });

        if (!customer) {
            return res.status(404).send({ message: 'Customer info not found', isSuccess: false });
        }

        const depositOrders = await DepositModel.find({ customerId: customer._id })
            .populate({
                path: 'propertyId',
                select: 'address price area status'
            });

        // Populate employee information for each property
        for (let order of depositOrders) {
            const property = await PropertiesModel.findById(order.propertyId._id);
            const employee = await EmployeeModel.findById(property.employeeId);
            order._doc.employeeInfo = {
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                phone: employee.phone
            };
        }

        res.send({ data: depositOrders, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 14: Manager views all deposit orders in the system
export const getAllDepositOrders = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== 'MANAGER') {
            return res.status(403).send({ message: 'Only manager can access this', isSuccess: false });
        }

        const depositOrders = await DepositModel.find()
            .populate({
                path: 'customerId',
                select: 'name email phone'
            })
            .populate('propertyId');

        res.send({ data: depositOrders, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};
