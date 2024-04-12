import { Router } from "express";
import {
  createModel,
  getModels,
  deleteModel,
  getUsers,
} from "../controller/app";
import { getAdmin } from "../middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/create", getAdmin, upload.array("files"), createModel);
router.get("/models", getModels);
router.get("/users", getUsers);
router.delete("/delete/:id", getAdmin, deleteModel);
export default router;
