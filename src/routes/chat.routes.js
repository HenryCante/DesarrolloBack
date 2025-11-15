import { Router } from "express";
import { getChatMensajes } from "../controllers/chat.controllers.js";

const router = Router();

router.get("/", getChatMensajes);

export default router;
