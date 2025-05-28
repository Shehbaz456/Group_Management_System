import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user,
    });
});

export default router;
