import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

//placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://foody-islam.vercel.app"
  try {
    console.log('Request Body:', req.body);
    const newOrder = await orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 30 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    })
    res.json({success:true, session_url:session.url})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:'Error while place order'})
  }
};

//verify payment and order status
const verifyOrder = async (req,res)=>{
const {orderId, success} = req.body;
try {
    if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true})
        res.json({success:true, message:"Paid"})
    }else{
        await orderModel.findByIdAndDelete(orderId,{payment:false});
        res.json({success:false, message:"Not Paid"})
    }
} catch (error) {
    console.log(error)
    res.json({success:false, message:"Error in verifying payment"})
}
}


//user orders 
const userOrders = async (req,res)=>{
 try {
  const orders = await orderModel.find({userId:req.body.userId})
  res.json({success:true, data:orders})
 } catch (error) {
  console.log(error)
  res.json({success:false, message:"Error in getting user orders"})
 }
} 



// listing orders in admin panel
const listOrders = async (req,res)=>{
try {
  const orders = await orderModel.find({})
res.json({success:true, data:orders})
} catch (error) {
  console.log(error)
  res.json({success:false, message:'Error in listing orders in admin panel' })
}
}
//update order status from admin panel
const updateStatus = async (req,res)=>{
try {
  await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
  res.json({success:true, message:'Status updated successfully'})
} catch (error) {
  console.log(error)
  res.json({success:false, message:'Error in updating order status in admin panel'})
}
}

export { placeOrder,verifyOrder,userOrders, listOrders, updateStatus };
