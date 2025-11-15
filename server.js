import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import chatRoutes from "./src/routes/chat.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: "*",   // temporal; luego lo cambiamos a tu dominio de Netlify
  methods: "GET,POST",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());

app.use("/api/chat", chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
