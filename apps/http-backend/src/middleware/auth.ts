import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

interface JwtPayload {
  _id: string;
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "No token provided. Please login first.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded._id) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Token is not valid or expired",
    });
  }
};
