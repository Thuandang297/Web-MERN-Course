import express from 'express'
import mongoose from 'mongoose'
import ENV from './config/environment.js'
import customerRoute from './routes/customers.js'

const app = express()

//Ket noi toi database
app.use(express.json())

//Config dotenv
// dotenv.config()

mongoose.connect(ENV.DATABASE_CONNECTION)

//Ex1:  Viết API đăng ký tài khoản người dùng với các thông tin 
//email, password, name, age

app.use('/api/v1/customers', customerRoute)


app.listen(ENV.PORT,()=>{
    console.log('Server is running!');
})
