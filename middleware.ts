import { Request, Response, NextFunction } from "express";
import createSupabaseClient from "./utils/client";

export default async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookie = req.cookies;
    const token = cookie["sb-jsjoswfatcvghzacmiqj-auth-token"];
    const parsedToken = JSON.parse(token);
    if (
      parsedToken.access_token === undefined ||
      parsedToken.access_token === null ||
      parsedToken.access_token === ""
    ) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const supabase = await createSupabaseClient();
    const { data: user, error } = await supabase.auth.getUser(
      parsedToken.access_token
    );
    if (user.user === null) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    if (error) console.log("Supabase error", error);
    next();
  } catch (error) {
    console.log("Error in resolving middleware", error);
    return res.status(403).json({ message: "Not Passed" });
  }
}
