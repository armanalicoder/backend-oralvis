import mongoose from "mongoose";

export default async function connectToDB(){
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Database Connected");
    })
    .catch((err)=>{
        console.log("Database connection failed",err);
    })
}