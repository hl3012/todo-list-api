import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validateLogin, validateRegister } from "../utils/validation";
// import { getAllUsers } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

//test endpoint for debugging
// router.get("/users", getAllUsers);

export default router;
