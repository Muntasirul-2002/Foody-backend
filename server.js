import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = 4000;

app.use(express.json());

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://foody-backend-k0z8.onrender.com",
    "https://foody-backend-k0z8.onrender.com/",
    "https://foody-islam.vercel.app/",
    "https://foody-islam.vercel.app",
    "https://foody-admin-islam.vercel.app",
    "https://foody-admin-islam.vercel.app/",
    undefined,
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS from origin: ${origin}`));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware to set additional headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// db connection
connectDB();

// APIs
app.use("/api/food", foodRouter);
app.use('/api/user', userRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Foody Backend!!');
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
