import express from 'express';
import mongoose from 'mongoose';
import UsersModel from './model/users.js';

mongoose.connect('mongodb+srv://trello-database:RMwUJXBPc1RJ17ST@trello-cluster.cdzlw.mongodb.net/?retryWrites=true&w=majority&appName=trello-cluster');
const app = express();
app.use(express.json());

app.post('/api/v1/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        if (!name) throw new Error('userName is required!');
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
});

//1.Get all customers
app.get('/customers', async (req, res) => {
    try {
        const customersResponse = await UsersModel.find({});
        res.status(200).send({ message: "OK", data: customersResponse, success: true })
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
})

//2.Get customer by id

app.get('/customers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("🚀 ~ id:", id)
        if (!id) throw new Error('Id is invalid')
        const customerResponse = await UsersModel.findById(id);
        res.status(200).send({ message: "OK", data: customerResponse, success: true })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }

})

app.listen(8080, () => {
    console.log('Server is running!');
});