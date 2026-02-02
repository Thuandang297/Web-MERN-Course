import dotenv from 'dotenv';
dotenv.config()

const ENV = {
    DATABASE_CONNECTION: process.env.MONGODB_URI,
    PORT:process.env.PORT
}

export default ENV;