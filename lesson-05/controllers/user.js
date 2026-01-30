import UsersModel from "../models/users.js";

const usersController = {
    createUser: async (req, res) => {
        try {
            const { name, email, age } = req.body;
            if (!name) throw new Error('name is required!');
            if (!email) throw new Error('email is required!');

            const createdUser = await UsersModel.create({
                name,
                email,
                age,
            });
            res.status(201).send({
                data: createdUser,
                message: 'Register successful!',
                success: true
            });
        } catch (error) {
            res.status(403).send({
                message: error.message,
                data: null,
                success: false
            });
        }
    },
    getUser: async (req, res) => {
        try {
            const response = await UsersModel.find({});
            res.status(201).send({
                data: response,
                message: 'Register successful!',
                success: true
            });
        } catch (error) {
            res.status(403).send({
                message: error.message,
                data: null,
                success: false
            });
        }
    },
    updateUser: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, age } = req.body;
            if (!name) throw new Error('name is required!');
            if (!email) throw new Error('email is required!');

            const updatedUser = await UsersModel.findByIdAndUpdate(id,
                {
                    $set: {
                        name,
                        email,
                        age,
                    }

                },
                { new: true }
            );
            res.status(201).send({
                data: updatedUser,
                message: 'Updated successful!',
                success: true
            });
        } catch (error) {
            res.status(403).send({
                message: error.message,
                data: null,
                success: false
            });
        }
    },
    deleteUser: async (req, res)=>{
        try {
            const id = req.params.id;
            const deletedUser = await UsersModel.findOneAndDelete({_id:id});
                res.status(200).send({
                data: deletedUser,
                message: 'Deleted successful!',
                success: true
            });
        } catch (error) {
               res.status(403).send({
                message: error.message,
                data: null,
                success: false
            });
        }
    }
}

export default usersController;
