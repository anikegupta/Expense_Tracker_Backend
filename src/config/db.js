import mongoose from 'mongoose'
import { mongoURI } from '../utils/constants.js'

 async function connectDb()
{
    try{
        await mongoose.connect(mongoURI)
        console.log("database connected")
    }
    catch(e)
    {
        console.log("error in connecting db")
    }
}
connectDb()

export default connectDb