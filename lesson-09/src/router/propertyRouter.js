import express from 'express';
import multer from 'multer';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import {
    createProperty,
    updateProperty,
    getEmployeeProperties
} from '../controller/propertyController.js';
import PropertiesModel from '../models/properties.js';

const propertyRouter = express.Router();

// Setup multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API 13: Employee views the list of properties they manage - MUST come before /:propertyId
propertyRouter.get('/my-properties', authMiddleware, roleMiddleware(['EMPLOYEE']), getEmployeeProperties);

// Get all properties (optional) - MUST come before /:propertyId
propertyRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const properties = await PropertiesModel.find();
        res.send({ data: properties, message: 'Success', isSuccess: true });
    } catch (error) {
        res.status(500).send({ message: error.message, isSuccess: false });
    }
});

// API 8: Manager or Employee creates Property information (with images)
propertyRouter.post('/', authMiddleware, roleMiddleware(['MANAGER', 'EMPLOYEE']), upload.single('image'), createProperty);

// API 9: Manager or Employee updates Property information (with images)
propertyRouter.put('/:propertyId', authMiddleware, roleMiddleware(['MANAGER', 'EMPLOYEE']), upload.single('image'), updateProperty);

export default propertyRouter;
