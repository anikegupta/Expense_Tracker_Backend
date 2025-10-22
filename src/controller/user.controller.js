import User from '../models/users.js'
import bcrypt from "bcrypt"
import {createToken} from "../utils/jwtUtil.js"
export const allUsers=async(req,resp)=>
{
   const users=await User.find()    
   resp.status(200).json(users)
}

export const singleUser=async(req,resp)=>
{
const {userId}=req.params
const user=await User.findOne({
    _id:userId,
})
resp.status(200).json(user)
}

export const createUser=async(req,resp)=>
{
 const{username,email,password}=req.body
try{
     const user =await User.create(
    {
        username,
        email,
        password,
    }
 )
 resp.status(201).json(user)
}

catch(e)
{
 const error=Object.values(e.errors).map((ob)=>{
    return{
        property:ob.properties.path,
        errorValue:ob.message,
    }
 })
 resp.status(400).json(error)
}
}

export const updateUser=async(req,resp)=>
{
    const {userId}=req.params
    const{username,password,email}=req.body
    await User.updateOne(
        {_id:userId,},
        {
            username,
            password,
            email,
        }
    )

    const updatedUser=await User.findOne(
        {
            _id:userId,
        }
    )
    resp.status(200).json(updatedUser)
}

export const deleteUser=async(req,resp)=>
{
    const{userId}=req.params
    await User.findByIdAndDelete(userId)
    resp.json(
        {
            message:"Expense deleted",
        }
    )
}

