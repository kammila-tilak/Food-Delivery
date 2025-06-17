import mongoose from "mongoose";

export const connectDB = async () => {
    
    await mongoose.connect('mongodb+srv://kammilatilak:2002138445Tt@cluster0.6bcj3cd.mongodb.net/?').then(()=>console.log("DB Connected"));
}

