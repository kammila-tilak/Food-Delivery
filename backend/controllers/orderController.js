import OrderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order from frontend
const placeOrder = async(req,res) =>{

    const frontend_url = "http://localhost:5173"; 

    try{
        if (!req.userId) {
            return res.json({ success: false, message: "Authentication failed: User ID not found in request." });
        }
        const userId = req.userId; 
        const newOrder = new OrderModel({
            userId: userId, 
            items: req.body.items, 
            amount: req.body.amount, 
            address: req.body.address, 
            status: "Food Processing", 
            date: Date.now(),          
            payment: false            
        });

        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr", 
                product_data: {
                    name: item.name 
                },
                unit_amount: Math.round(item.price * 100) 
            },
            quantity: item.quantity 
        }));

        if (req.body.amount > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Charges"
                    },
                    unit_amount: Math.round(50 * 100) 
                },
                quantity: 1
            });
        }
       
        const session = await stripe.checkout.sessions.create({
            line_items: line_items, 
            mode: 'payment',         
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`, 
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`  
        });

        res.json({ success: true, session_url: session.url }); 

    } catch (error) {
        console.error("Error placing order:", error); 
        res.json({ success: false, message: error.message || "Error placing order: An unknown server error occurred." });
    }
};

const verifyOrder = async(req,res)=>{
    const {orderId,success} = req.body;
    try{
        if(success=="true"){
            await OrderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await OrderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

//user orders for frontend
const userOrders = async (req,res) =>{
    try{
        if (!req.userId) { // Safeguard to ensure user is authenticated
            return res.json({ success: false, message: "Authentication failed: User ID not found." });
        }
        const userId = req.userId; // Get user ID from authenticated request

        const orders = await OrderModel.find({ userId: userId }); // Corrected line
        res.json({success:true,data:orders})
    }catch(error){
        console.error("Error fetching user orders:", error); // Use console.error
        res.json({success:false,message: error.message || "Error fetching user orders"}) // More descriptive message
    }
}
//listing oorders for admin pannel
const listOrders = async(req,res)=>{
    try{
        const orders = await OrderModel.find({});
        res.json({success:true,data:orders})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
//api for updating order status
const updateStatus = async(req,res)=>{
    try{
        await OrderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };
