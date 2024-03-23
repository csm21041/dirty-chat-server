import { Request, Response, NextFunction } from "express";
import createSupabaseClient from "./utils/client";

export default async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies;
    const token = cookies.token;
    if (token === "") {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
    const supabase = await createSupabaseClient();
    const { data: user, error } = await supabase.auth.getUser(token);
    if (user === null) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    next();
  } catch (error) {
    console.log("Error in resolving middleware", error);
  }
}
