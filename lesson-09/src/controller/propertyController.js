import { v2 as cloudinary } from 'cloudinary';
import PropertiesModel from '../models/properties.js';
import EmployeeModel from '../models/employees.js';

// Helper function to upload image to cloudinary
const uploadImageToCloudinary = async (file, fileName) => {
    return new Promise((resolve, reject) => {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        cloudinary.uploader.upload(dataUrl, {
            public_id: fileName,
            resource_type: 'auto',
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.secure_url);
            }
        });
    });
};

// API 8: Manager or Employee creates Property information (with images)
export const createProperty = async (req, res) => {
    try {
        const { accountId, role } = req.user;
        const file = req.file;

        if (!['MANAGER', 'EMPLOYEE'].includes(role)) {
            return res.status(403).send({ message: 'Only manager or employee can create property', isSuccess: false });
        }

        const { address, price, area, status } = req.body;

        // Get employee info
        const employee = await EmployeeModel.findOne({ accountId });

        if (!employee) {
            return res.status(404).send({ message: 'Employee info not found', isSuccess: false });
        }

        let imageUrl = null;
        if (file) {
            const fileName = `property-${Date.now()}`;
            imageUrl = await uploadImageToCloudinary(file, fileName);
        }

        const newProperty = await PropertiesModel.create({
            address,
            price,
            area,
            status: status || 'ONSALE',
            employeeId: employee._id,
            imageUrl
        });

        res.status(201).send({ 
            data: newProperty, 
            message: 'Property created successfully', 
            isSuccess: true 
        });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 9: Manager or Employee updates Property information (with images)
export const updateProperty = async (req, res) => {
    try {
        const { accountId, role } = req.user;
        const { propertyId } = req.params;
        const file = req.file;

        if (!['MANAGER', 'EMPLOYEE'].includes(role)) {
            return res.status(403).send({ message: 'Only manager or employee can update property', isSuccess: false });
        }

        const property = await PropertiesModel.findById(propertyId);

        if (!property) {
            return res.status(404).send({ message: 'Property not found', isSuccess: false });
        }

        // Check if employee is the owner of the property or manager
        if (role === 'EMPLOYEE') {
            const employee = await EmployeeModel.findOne({ accountId });
            if (!employee || employee._id.toString() !== property.employeeId.toString()) {
                return res.status(403).send({ message: 'You can only update your own properties', isSuccess: false });
            }
        }

        const { address, price, area, status } = req.body;

        let updateData = {};
        if (address) updateData.address = address;
        if (price) updateData.price = price;
        if (area) updateData.area = area;
        if (status) updateData.status = status;

        // Handle image update
        if (file) {
            const fileName = `property-${propertyId}-${Date.now()}`;
            const imageUrl = await uploadImageToCloudinary(file, fileName);
            updateData.imageUrl = imageUrl;
        }

        const updatedProperty = await PropertiesModel.findByIdAndUpdate(
            propertyId,
            updateData,
            { new: true }
        );

        res.send({ 
            data: updatedProperty, 
            message: 'Property updated successfully', 
            isSuccess: true 
        });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};

// API 13: Employee views the list of properties they manage
export const getEmployeeProperties = async (req, res) => {
    try {
        const { accountId, role } = req.user;

        if (role !== 'EMPLOYEE') {
            return res.status(403).send({ message: 'Only employee can access this', isSuccess: false });
        }

        const employee = await EmployeeModel.findOne({ accountId });

        if (!employee) {
            return res.status(404).send({ message: 'Employee info not found', isSuccess: false });
        }

        const properties = await PropertiesModel.find({ employeeId: employee._id });

        res.send({ data: properties, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
};
