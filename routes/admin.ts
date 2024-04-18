import { Router } from "express";
import {
  createModel,
  getModels,
  deleteModel,
  getUsers,
  getTokenRequests,
} from "../controller/app";
import { getAdmin } from "../middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/create", getAdmin, upload.array("files"), createModel);
router.get("/models", getModels);
router.get("/users", getUsers);
router.get("/tokenRequests", getTokenRequests);
router.delete("/delete/:id", getAdmin, deleteModel);
export default router;
