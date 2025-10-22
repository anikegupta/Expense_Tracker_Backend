import { Router } from "express";
import { allUsers, createUser, deleteUser, singleUser, updateUser } from "../controller/user.controller.js";

const userRouter=Router()

userRouter.get("/users",allUsers)
userRouter.get("/users/:userId",singleUser)
userRouter.post("/users",createUser)
userRouter.put("/users/:userId",updateUser)
userRouter.delete("/users/:userId",deleteUser)


export default userRouter