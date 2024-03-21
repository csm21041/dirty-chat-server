require("dotenv").config();
import express from "express";
const app = express();
const Port = process.env.PORT;
import cors from "cors";
import {
  createModel,
  getModels,
  getModel,
  storeMessage,
  getMessages,
} from "./controller/createModel";
import signup from "./controller/auth/signup";
import login from "./controller/auth/login";
import logout from "./controller/auth/logout";
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const Origin_Url = process.env.ORIGIN_URL;
app.use(cors({ origin: [`${Origin_Url}`], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/admin/create", upload.array("files"), createModel);
app.get("/admin/models", getModels);
app.get("/user/model/:id", getModel);
app.post("/user/store", storeMessage);
app.post("/auth/signup", signup);
app.post("/auth/login", login);
app.get("/auth/logout", logout);
app.get("/user/getMessages/:id", getMessages);
app.listen(Port, () => console.log(`Backend is running at ${Port}`));
