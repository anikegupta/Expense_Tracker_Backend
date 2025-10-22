import { Router } from "express";
import { chatWithAi } from "../controller/ai.controller.js";
import { getSuggestions } from "../controller/ai.controller.js";

const aiRouter = Router();

// POST /api/ai
aiRouter.post("/ai/suggestions", getSuggestions);
aiRouter.get("/ai/chat", chatWithAi);

export default aiRouter;