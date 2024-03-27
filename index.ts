require("dotenv").config();
import express from "express";
const app = express();
const Port = process.env.PORT;
import cors from "cors";

import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import getUser from "./middleware";
const Origin_Url = process.env.ORIGIN_URL;

app.use(
  cors({
    origin: ["https://dirty-chat-ai.vercel.app/", "http://localhost:3000/"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", getUser, adminRoutes);
app.use("/user", getUser, userRoutes);
app.use("/auth", authRoutes);

app.listen(Port, () => console.log(`Backend is running at ${Port}`));
