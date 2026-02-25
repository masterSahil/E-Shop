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

const healthRouter = require('./routes/healthRoutes');

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App is Listening on Port ${PORT}`);
})

connectDB();

app.use(cors({
    origin: process.env.LIVE_URL,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', loginVerify);
app.use('/', cartRouter);
app.use('/', healthRouter);