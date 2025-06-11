import mongoose from "mongoose";

mongoose.set('strictQuery',true)

const connection = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conectado la maleducada")
    }catch(err){
        console.log(err)
    }
}

export default connection