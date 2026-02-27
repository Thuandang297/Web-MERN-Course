import express from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import {
    getPersonalInfo,
    createPersonalInfo,
    createEmployeeByManager,
    getEmployeesUnderManager
} from '../controller/userController.js';

const userRouter = express.Router();

// API 5: Get personal information according to role
userRouter.get('/profile', authMiddleware, getPersonalInfo);

// API 6: Create personal information according to role
userRouter.post('/profile', authMiddleware, createPersonalInfo);

// API 7: Manager creates account and information for Employee
userRouter.post('/employee', authMiddleware, roleMiddleware(['MANAGER']), createEmployeeByManager);

// API 15: Manager gets personal information of all employees under their management
userRouter.get('/employees', authMiddleware, roleMiddleware(['MANAGER']), getEmployeesUnderManager);

export default userRouter;
