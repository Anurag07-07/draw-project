import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Request,Response} from 'express'
import {prisma} from '@repo/db/db'
import {UserSignupValidation,UserSigninValidation,UserChatValidation} from '@repo/common/common'


export const SignUp = async (req: Request, res: Response) => {
  const checkValidation = UserSignupValidation.safeParse(req.body);


  if (!checkValidation.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: checkValidation.error.message,
    });
  }

  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in database
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Send success response
    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};


export const SignIn = async (req: Request, res: Response) => {
  // Validate input data
  const checkValidation = UserSigninValidation.safeParse(req.body);
  if (!checkValidation.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: checkValidation.error.message,
    });
  }

  try {
    const { username, password } = req.body;

    // Check if user exists
    const check = await prisma.user.findFirst({
      where: { username },
    });

    if (!check) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //  Compare password
    const match = await bcrypt.compare(password, check.password!);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //  Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { _id: check.id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //  Send token in HTTP-only cookie (more secure)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // Changed from 'strict' to allow cross-origin requests
      path: "/",
      maxAge: 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("SignIn error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

export const roomCreation = async (req: Request, res: Response) => {
  const checkRoom = UserChatValidation.safeParse(req.body);
  if (!checkRoom.success) {
    return res.status(400).json({
      message: "Invalid room data",
      error: checkRoom.error.message,
    });
  }

  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - please login first",
      });
    }

    const { slug } = req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { slug },
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "Room with this slug already exists",
      });
    }

    const roomCreated = await prisma.room.create({
      data: {
        adminId: userId,
        slug,
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      roomId: roomCreated.id,
    });
  } catch (error) {
    console.error("Room creation error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id as string);

    const message = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
         id: "asc"
      }
    });

    console.log(message);
    

    if (!message) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      chats:message 
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};


export const Logout = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "lax", // Changed from 'strict' to 'lax' to allow cross-origin cookie deletion
    path: "/",
    expires: new Date(0), // delete cookie
  });

  return res.status(200).json({ message: "Logged out successfully" });
};


export const getRooms = async(req:Request,res:Response)=>{
  try {
    const rooms = await prisma.room.findMany({
      where:{
        adminId: req.userId
      }
    })

    return res.status(200).json({
      rooms
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    })
  }
}

export const getDrawings = async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id as string);

    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const drawings = await prisma.drawingElement.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return res.status(200).json({
      drawings
    });
  } catch (error) {
    console.error("Get drawings error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const room = await prisma.room.findUnique({
      where: {
        slug: slug
      }
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      room
    });

  } catch (error) {
    console.error("Get room error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const getToken = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { _id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Get token error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};