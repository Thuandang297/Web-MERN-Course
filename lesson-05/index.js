import express from 'express';
import mongoose from 'mongoose';
// import usersController from "./controllers/user.controller.js"
// import userRouters from './routes/user.router.js';
import customerRouters from './routes/customer.js'
import userRouters from './routes/user.js'
import orderRouters from './routes/order.js'
import productRouter from './routes/product.js';

mongoose.connect('mongodb+srv://trello-database:Thuan%40627@trello-cluster.cdzlw.mongodb.net/?appName=trello-cluster');
const app = express();
app.use(express.json());

app.use('/api/v1/customers', customerRouters)

app.use('/api/v1/users', userRouters)

app.use('/api/v1/orders', orderRouters)

app.use('/api/v1/products', productRouter)



//Customer

app.listen(8080, () => {
    console.log('Server is running!');
});