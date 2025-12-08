import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || "Temporary";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "15m" });
};

interface MyPayLoad extends jwt.JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): MyPayLoad => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as MyPayLoad;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      throw error;
    }
  }
};
