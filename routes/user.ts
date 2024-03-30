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

router.get("/model/:id", getModel);
router.post("/store", storeMessage);
router.delete("/:uid/deleteChat/:mid", deleteChat);
router.get("/getMessages/:uid/:mid", getMessages);
router.get("/getToken/:uid", getToken);

export default router;
