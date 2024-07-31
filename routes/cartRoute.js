import express from "express";
import { addToCart, getCart, removeFromCart } from "../controller/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart",authMiddleware, addToCart);
cartRouter.post("/remove-from-cart",authMiddleware ,removeFromCart);
cartRouter.post("/get-cart-items", authMiddleware,getCart);


export default cartRouter