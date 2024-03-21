import { PrismaClient } from "@prisma/client";
import createSupabaseClient from "../../utils/client";
import { Request, Response } from "express";

export default async function login(req: Request, res: Response) {
  const supabase = createSupabaseClient();
  const prisma = new PrismaClient();
  let user = null;
  try {
    const { email, password, isAdmin } = req.body;
    if (isAdmin) {
      user = await prisma.admin.findFirst({
        where: {
          email: email,
          password: password,
        },
      });
      if (user == null)
        return res.status(403).json({ message: "Invalid Credentials" });
      else
        res.cookie("admin", true, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
    } else {
      user = await prisma.user.findFirst({
        where: {
          email: email,
          password: password,
        },
      });
      if (user == null)
        return res.status(403).json({ message: "Invalid Credentials" });
    }
    const supabaseuser = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (supabaseuser == null)
      return res.status(403).json({ message: "Invalid Credentials" });
    res.cookie("token", supabaseuser.data.session?.access_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    console.log(user);
    return res.status(200).json({ message: user?.id });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "User unauthorized", error: error });
  }
}