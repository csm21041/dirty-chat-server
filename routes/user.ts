import { Router } from "express";
import {
  getModel,
  storeMessage,
  getMessages,
  deleteChat,
  getToken,
} from "../controller/app";
import getUser from "../middleware";

const router = Router();

router.get("/model/:id", getUser, getModel);
router.post("/store", getUser, storeMessage);
router.delete("/:uid/deleteChat/:mid", getUser, deleteChat);
router.get("/getMessages/:uid/:mid", getUser, getMessages);
router.get("/getToken/:uid", getUser, getToken);

export default router;
