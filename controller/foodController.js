import foodModel from "../models/foodModel.js";
import fs from 'fs'
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const image_filename = req.file.filename;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  });

  try {
    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error in Adding' });
  }
};



// get all food items
const allFood = async (req,res)=>{
try {
    const foods = await foodModel.find({})
    res.json({success:true, data:foods})
} catch (error) {
    console.log(error)
}
}


// remove food item
const removeFood = async (req, res) => {
  try {
      const food = await foodModel.findById(req.body.id);
      if (food) {
          // Delete the image file
          fs.unlink(`uploads/${food.image}`, (err) => {
              if (err) {
                  console.error("Error deleting image file:", err);
              }
          });

          // Delete the food item from the database
          await foodModel.findByIdAndDelete(req.body.id);
          res.json({ success: true, message: 'Food Removed' });
      } else {
          res.status(404).json({ success: false, message: 'Food not found' });
      }
  } catch (error) {
      console.error("Error removing food:", error);
      res.status(500).json({ success: false, message: 'Error removing food' });
  }
};
export {addFood,allFood,removeFood}