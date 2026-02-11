const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoutes');
const loginVerify = require('./routes/loginVerify');
const cartRouter = require('./routes/cartRoutes');

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App is Listening on Port ${PORT}`);
})

connectDB();

app.use(cors({
    origin: 'https://e-shop-pearl-gamma.vercel.app/',
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', loginVerify);
app.use('/', cartRouter);