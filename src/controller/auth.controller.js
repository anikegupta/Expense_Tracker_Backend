import User from '../models/users.js'
import bcrypt from "bcrypt"
import {createToken} from "../utils/jwtUtil.js"

export const loginUser=async (req,resp)=>
{
    const{email,password}=req.body
    if(!email || !password)
    {
        return resp.status(403).json({
            message:"invalid credentials"
        })
    }

    const user=await User.findOne({email})
    if(!user)
    {
        return resp.status(403).json({
            message:"invalid Username or Password"
        })
    }

    const match=await bcrypt.compare(password,user.password)
    if(!match)
    {
        return resp.status(403).json({
            message:"invalid Username or Password"
        })
    }

    const accessToken=createToken(user)
    resp.json({
        accessToken,
        user,
    })
}