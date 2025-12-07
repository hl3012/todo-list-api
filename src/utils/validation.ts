import { Request, Response, NextFunction } from "express";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    const errors =[];

    //validate username
    if (!username || username.trim().length === 0) {
        errors.push("Username is empty");
    } else if (username.trim().length < 3) {
        errors.push("Username must be at least 3 characters");
    }

    //validate password
    if (!password || password.trim().length === 0) {
        errors.push("Password is empty");
    } else if (password.trim().length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    //validate email
    if (!email || email.trim().length === 0) {
        errors.push("Email is empty");
    } else if (!email.includes("@")) {
        errors.push("Email is invalid");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const errors =[];

    if (!password || password.trim().length === 0) {
        errors.push("Password is empty");
    }

    //validate email
    if (!email || email.trim().length === 0) {
        errors.push("Email is empty");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}