import auth from "../middleware/auth.js";
import express from "express";
import { sendConnectionRequest } from "../controllers/connectioncontroller.js"; 
const router = express.Router();

router.post("/request/:receiverId", auth, sendConnectionRequest);