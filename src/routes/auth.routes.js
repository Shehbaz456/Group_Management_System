import { Router } from "express";
const router = Router();

import { AuthLogin, AuthLogout, AuthRefresh } from "../controllers/auth.controller.js";


router.post("/login", AuthLogin);
router.get("/refresh", AuthRefresh);
router.post("/logout", AuthLogout);

export default router;