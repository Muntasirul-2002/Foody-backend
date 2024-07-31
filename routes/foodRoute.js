import express from "express";

import { addFood, allFood, removeFood } from "../controller/foodController.js";

import { upload } from "../controller/MulterController.js";

const foodRouter = express.Router();

//add foods
foodRouter.post('/add', upload, addFood);

//get all foods
foodRouter.get('/list', allFood)

//remove food items
foodRouter.delete('/remove-food', removeFood)

export default foodRouter;
