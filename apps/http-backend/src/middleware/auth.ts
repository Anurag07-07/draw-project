import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

interface JwtPayload {
  _id: string;
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies?.token;
    
    console.log('🔐 Auth Middleware - Cookies token:', token ? 'exists' : 'missing');
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      console.log('🔐 Auth Middleware - Authorization header:', authHeader.substring(0, 20) + '...');
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
        console.log('🔐 Auth Middleware - Extracted token from header');
      }
    }

    if (!token) {
      console.log('❌ Auth Middleware - No token found in cookies or header');
      return res.status(401).json({
        message: "No token provided. Please login first.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.log('❌ Auth Middleware - JWT_SECRET not defined!');
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    console.log('🔐 Auth Middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    console.log('✅ Auth Middleware - Token verified, user ID:', decoded._id);

    if (!decoded || !decoded._id) {
      console.log('❌ Auth Middleware - Invalid token payload');
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    console.error("Error details:", (error as Error).message);
    return res.status(401).json({
      message: "Token is not valid or expired",
    });
  }
};
