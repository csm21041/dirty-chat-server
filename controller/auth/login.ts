import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function login(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    const payload = {
      id: user?.id,
      email: user?.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    if (user == null)
      return res.status(403).json({ message: "Invalid Credentials" });
    return res.status(200).json({ message: user?.id });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "User unauthorized", error: error });
  }
}
