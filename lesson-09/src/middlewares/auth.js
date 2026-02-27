import jwt from 'jsonwebtoken';
import AccountModel from '../models/accounts.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: 'Token not found', isSuccess: false });
        }

        const decoded = jwt.verify(token, 'test-token-2026');
        
        const account = await AccountModel.findById(decoded.id);
        
        if (!account || !account.isActive) {
            return res.status(401).send({ message: 'Account not found or inactive', isSuccess: false });
        }

        req.user = {
            accountId: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(403).send({ message: error.message, isSuccess: false });
    }
};

export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send({ message: 'Access denied', isSuccess: false });
        }
        next();
    };
};
