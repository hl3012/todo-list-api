import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "SECRET";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "1d" });
};


interface MyPayLoad extends jwt.JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): MyPayLoad => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as MyPayLoad;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
