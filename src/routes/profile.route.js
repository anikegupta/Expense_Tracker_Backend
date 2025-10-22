import { Router } from "express";
import { getProfile, updateProfile,deleteAvatar } from "../controller/profile.controller.js";




// Configure multer


const router = Router();

router.get("/profile", getProfile);
router.put("/profile",  updateProfile);
router.delete("/profile/avatar", deleteAvatar);


export default router;
