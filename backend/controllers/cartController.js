// import userModel from "../models/userModel.js"

// // add item to user cart
// // const addToCart = async (req,res)=>{
// //     try {
// //         let userData = await userModel.findById(req.body.userId);
// //         let cartData = await userData.cartData;
// //         if(!cartData[req.body.itemId]){
// //             cartData[req.body.itemId] = 1
// //         }
// //         else{
// //             cartData[req.body.itemId] += 1 
// //         }
// //         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
// //         res.json({succes:true,message:"Added To Cart"});
// //     }
// //     catch(error){
// //         console.log(error);
// //         res.json({succes:false,message:"Error"})
// //     }
// // }

// const addToCart = async (req,res)=>{
//     try {
//         let user = await userModel.findById(req.body.userId); // PROBLEM HERE
//         if (!user) {
//             return res.json({success: false, message: "User not found"});
//         }
        
//         let cartData = user.cartData || {}; // GOOD: Safely initializes cartData

//         if (!cartData[req.body.itemId]) {
//             cartData[req.body.itemId] = 1;
//         } else {
//             cartData[req.body.itemId] += 1;
//         }
        
//         user.cartData = cartData;
//         await user.save(); // GOOD: Saves the entire user document

//         res.json({success:true,message:"Added To Cart"});
//     }
//     catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"});
//     }
// }
// //remove item to user cart
// // const removeFromCart = async (req,res)=>{
// //     try{
// //         let userData = await userModel.findById(req.body.userId);
// //         let cartData = await userData.cartData;
// //         if (cartData[req.body.itemId]>0){
// //             cartData[req.body.itemId] -= 1;
// //         }
// //         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
// //         res.json({success:true,message:"Removes From Cart"})
// //     }catch(error){
// //         console.log(error);
// //         res.json({success:false,message:"Error"})
// //     }
// // }
// const removeFromCart = async (req,res)=>{
//     try{
//         let userData = await userModel.findById(req.body.userId); // PROBLEM HERE
//         let cartData = await userData.cartData; // PROBLEM HERE (awaiting non-promise)
//         if (cartData[req.body.itemId]>0){
//             cartData[req.body.itemId] -= 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData}); // PROBLEM HERE
//         res.json({success:true,message:"Removes From Cart"})
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// // fetch user cart data
// // const getCart = async(req,res) => {
// //     try{
// //         let userData = await userModel.findById(req.body.userId);
// //         let cartData = await userData.cartData;
// //         res.json({success:true,cartData})
// //     }catch(error){
// //         console.log(error);
// //         res.json({success:false,message:"Error"})
// //     }
// // }

// // fetch user cart data
// const getCart = async (req, res) => {
//     try {
//         if (!req.userId) {
            
//             return res.json({ success: false, message: "User not authenticated or ID missing." });
//         }
//         let userData = await userModel.findById(req.userId);

//         if (!userData) {
//             return res.json({ success: false, message: "User data not found for authenticated ID." });
//         }

//         let cartData = userData.cartData || {};

//         res.json({ success: true, cartData: cartData });

//     } catch (error) {
//         console.error("Error fetching cart data:", error.message || error);
//         res.json({ success: false, message: "Error fetching cart data" });
//     }
// };

// export {addToCart,removeFromCart,getCart}





import userModel from "../models/userModel.js";


const getAuthenticatedUserAndCart = async (req) => {
    if (!req.userId) {
        throw new Error("Authentication failed: User ID not found in request. Make sure authMiddleWare is applied and token is valid.");
    }

    let userData = await userModel.findById(req.userId);

   
    if (!userData) {
        throw new Error("User not found in database for the provided authenticated ID.");
    }

    let cartData = userData.cartData || {};
    
    // Return both the user data and their cart data
    return { userData, cartData };
};

// Add item to user cart
const addToCart = async (req, res) => {
    try {
        const { cartData } = await getAuthenticatedUserAndCart(req);

       
        const itemId = req.body.itemId;

       
        if (!itemId) {
            return res.json({ success: false, message: "Item ID is required in the request body." });
        }

        if (cartData[itemId]) {
            cartData[itemId] += 1; 
        } else {
            cartData[itemId] = 1;   
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.json({ success: false, message: error.message || "Error adding item to cart" });
    }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        const { cartData } = await getAuthenticatedUserAndCart(req);

        const itemId = req.body.itemId;

        if (!itemId || !cartData[itemId]) {
            return res.json({ success: false, message: "Item not found in cart or invalid Item ID." });
        }
        if (cartData[itemId] > 1) {
            cartData[itemId] -= 1; 
        } else {
            delete cartData[itemId]; 
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData });

        res.json({ success: true, message: "Removed From Cart" });

    } catch (error) {
            console.error("Error removing from cart:", error);
            res.json({ success: false, message: error.message || "Error removing item from cart" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const { cartData } = await getAuthenticatedUserAndCart(req);

        res.json({ success: true, cartData: cartData });

    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.json({ success: false, message: error.message || "Error fetching cart data" });
    }
};

export { addToCart, removeFromCart, getCart };
