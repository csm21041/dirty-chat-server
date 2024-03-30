import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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
    if (user == null)
      return res.status(403).json({ message: "Invalid Credentials" });
    return res.status(200).json({ message: user?.id });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "User unauthorized", error: error });
  }
}
