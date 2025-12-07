import {Router} from "express";

const router = Router();

router.get("/todos", (req, res) => {
    res.json({message: "Get all todos"});
})

router.post("/", (req, res) => {
    res.json({message: "Todo created successfully"});
})

router.delete("/:id", (req, res) => {
    res.json({message: `Get todo by id ${req.params.id}`});
})

router.put("/:id", (req, res) => {
    res.json({message: `Update todo by id ${req.params.id}`});
})

export default router;