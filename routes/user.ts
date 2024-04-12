import { Router } from "express";
import {
  getModel,
  storeMessage,
  getMessages,
  deleteChat,
  getToken,
  deleteUser,
} from "../controller/app";
import { getAdmin, getUser } from "../middleware";

const router = Router();

router.get("/model/:id", getModel);
router.post("/store", getUser, storeMessage);
router.delete("/:uid/deleteChat/:mid", getUser, deleteChat);
router.get("/getMessages/:uid/:mid", getUser, getMessages);
router.get("/getToken/:uid", getToken);
router.delete("/delete/:id", getAdmin, deleteUser);

export default router;
