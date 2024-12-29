import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from "./src/config/mongodb.js";
import authRoutes from './src/routes/authRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import invoiceRoutes from './src/routes/invoiceRoutes.js'
import pdfRoute from './src/routes/pdfRoutes.js'
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use('/api/pdf', pdfRoute);


app.get('/', (req, res) => res.send("API WORKING"))

app.listen(port,()=>console.log(`Server started on ${port}`))