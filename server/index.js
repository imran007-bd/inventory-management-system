import express from 'express';
import cors from 'cors';
import process from 'node:process';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import productRoutes from './routes/productRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
app.use(
    cors({
        origin: [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean),
    })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/product', productRoutes);
app.use('/api/purchase-order', purchaseOrderRoutes);
app.use('/api/users', userRoutes);

const start = async () => {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

start();