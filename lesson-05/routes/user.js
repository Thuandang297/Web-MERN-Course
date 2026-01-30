// users.js
import usersController from "../controllers/user.js"
import express from 'express';

const router = express.Router();

router.post('/', usersController.createUser);
router.get('/', usersController.getUser)
router.put('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)

export default router;