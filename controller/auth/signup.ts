import { PrismaClient } from "@prisma/client";

export default async function signup(req: any, res: any) {
  const prisma = new PrismaClient();

  try {
    const { name, email, password } = req.body;
    await prisma.user.create({
      data: {
        username: name,
        email: email,
        password: password,
        tokenbalance: 100,
      },
    });
    return res.status(200).json({ message: "Signup Successfull" });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "User unauthorized" });
  }
}
