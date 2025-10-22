import { Router } from "express";
import { loginUser } from "../controller/auth.controller.js";
import { createUser } from "../controller/user.controller.js";

const authRouter=Router()

authRouter.post("/auth/login",loginUser)
authRouter.post("/auth/register",createUser)

export default authRouter