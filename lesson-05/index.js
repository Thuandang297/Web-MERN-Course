import express from 'express';
import mongoose from 'mongoose';
// import usersController from "./controllers/user.controller.js"
// import userRouters from './routes/user.router.js';
import customerRouters from './routes/customer.js'
mongoose.connect('mongodb+srv://trello-database:RMwUJXBPc1RJ17ST@trello-cluster.cdzlw.mongodb.net/?retryWrites=true&w=majority&appName=trello-cluster');
const app = express();
app.use(express.json());

app.use('/api/v1/customers', customerRouters)

// app.use('/api/v1/users', userRouters)

//Customer

app.listen(8080, () => {
    console.log('Server is running!');
});