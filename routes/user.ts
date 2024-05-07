import { Router } from "express";
import {
  getModel,
  storeMessage,
  getMessages,
  deleteChat,
  getToken,
  deleteUser,
  getUserInfo,
  requestToken,
} from "../controller/app";
import { getUser } from "../middleware";

const router = Router();

router.get("/model/:id", getModel);

router.post("/store", getUser, storeMessage);
router.get("/:id", getUserInfo);
router.delete("/:uid/deleteChat/:mid", getUser, deleteChat);
router.get("/getMessages/:uid/:mid", getUser, getMessages);
router.get("/getToken/:uid", getToken);
router.post("/requestToken/:id", getUser, requestToken);
router.delete("/delete/:id", getUser, deleteUser);

export default router;
