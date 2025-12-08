import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || "Temporary";

/**
 * Generates a JWT token for the given user id
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "15m" });
};

/**
 * Payload structure returned by verifyToken()
 */
interface MyPayLoad extends jwt.JwtPayload {
  userId: string;
}

/**
 * Verifies and returns the payload of a JWT token
 * @remarks casts the payload to MyPayLoad including userId
 */
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
