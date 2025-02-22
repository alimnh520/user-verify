import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb connected on : ${connection.connection.host}`);
    } catch (err) {;
        console.log('Mongodb connection error is : ', err);
        process.exit();
    }
}