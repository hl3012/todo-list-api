import {Router} from "express";

const router = Router();

router.post("/register", (req, res) => {
    res.json({message: "Register route"});
})

router.post("/login", (req, res) => {
    res.json({message: "Login route"});
})

export default router;