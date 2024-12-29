import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, addProduct); 
router.get("/",  authMiddleware, getProducts);

export default router;
