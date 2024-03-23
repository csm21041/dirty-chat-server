import { Router } from "express";
import { createModel, getModels, deleteModel } from "../controller/app";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/create", upload.array("files"), createModel);
router.get("/models", getModels);
router.delete("/delete/:id", deleteModel);

export default router;