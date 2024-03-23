import { Router } from "express";
import {
  getModel,
  storeMessage,
  getMessages,
  deleteChat,
} from "../controller/app";

const router = Router();

router.get("/model/:id", getModel);
router.post("/store", storeMessage);
router.delete("/:uid/deleteChat/:mid", deleteChat);
router.get("/getMessages/:uid/:mid", getMessages);

export default router;
