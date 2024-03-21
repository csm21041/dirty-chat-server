import createSupabaseClient from "../../utils/client";
import { PrismaClient } from "@prisma/client";

export default async function signup(req: any, res: any) {
  const supabase = createSupabaseClient();
  if (!supabase) return;
  const prisma = new PrismaClient();

  try {
    const { name, email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error)
      return res.status(411).json({ message: "Not able to make account" });
    await prisma.user.create({
      data: {
        username: name,
        email: email,
        password: password,
        tokenbalance: 100,
      },
    });
    console.log(data);
    res.cookie("token", data.session?.access_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ message: "Signup Successfull" });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "User unauthorized" });
  }
}
