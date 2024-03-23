import { Router } from "express";
import signup from "../controller/auth/signup";
import login from "../controller/auth/login";
import logout from "../controller/auth/logout";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
