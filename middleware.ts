import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const cookie = req.cookies;
    const token = cookie["token"];
    if (token === undefined || token === null || token === "") {
      console.log("Error in getting token");
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    if (user === null)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    next();
  } catch (error) {
    console.log("Error in resolving middleware", error);
    return res.status(403).json({ message: "Not Passed" });
  }
}
export async function getAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Unauthorized: Missing Headers" });
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    if (user === null)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    next();
  } catch (error) {
    console.log("Error in resolving middleware", error);
    return res.status(403).json({ message: "Not Passed" });
  }
}
