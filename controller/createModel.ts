import { PrismaClient, Model } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";
import createSupabaseClient from "../utils/client";
import fs from "fs";

interface ModelData {
  name: string;
  attributes: string[];
  description: string;
}

interface ImageData {
  filename: string;
  path: string;
}

interface MessageData {
  userId: number;
  modelId: number;
  message_text: string;
}

const prisma = new PrismaClient();

async function createModel(req: Request, res: Response) {
  try {
    const supabase = createSupabaseClient();
    const formData = req.body;
    const modelData: ModelData = JSON.parse(formData.data);
    const images = req.files as ImageData[];

    images.forEach(async (image) => {
      const imagefile = fs.readFileSync(image.path);
      const { data, error } = await supabase.storage
        .from("model_images")
        .upload(`${modelData.name}/${image.filename}`, imagefile, {
          upsert: true,
        });
      console.log(data);
      if (error) {
        console.log(error);
      }
    });

    fs.readdir(
      `./uploads`,
      (err: NodeJS.ErrnoException | null, files: Array<string>) => {
        if (err) console.log(err);
        files.forEach((file: string) => {
          fs.unlink(`./uploads/${file}`, (err) => {
            if (err) console.log(err);
          });
        });
      }
    );

    const profile_images: { [key: string]: string } = {};
    for (let i in images) {
      const { data } = supabase.storage
        .from("model_images")
        .getPublicUrl(`${modelData.name}/${images[i].filename}`);
      profile_images[`${i}`] = String(data.publicUrl);
    }

    await prisma.model.create({
      data: {
        name: modelData.name,
        attributes: modelData.attributes,
        system_prompts: {
          description: modelData.description,
        },
        profile_images: profile_images,
      },
    });

    return res.status(200).json({ message: "Model created" });
  } catch (error) {
    console.log(error);
  }
}

async function getModels(req: Request, res: Response) {
  try {
    const data: Model[] = await prisma.model.findMany({});
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function getModel(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data: Model | null = await prisma.model.findFirst({
      where: {
        id: id,
      },
    });
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function storeMessage(req: Request, res: Response) {
  try {
    const data: MessageData = req.body;
    console.log(data);
    // // const currTime = new Date().toLocaleTimeString();
    await prisma.messages.create({
      data: {
        userId: data.userId,
        modelId: data.modelId,
        status: "delievered",
        // chatId: 1,
        message_text: data.message_text,
        // timestamp: "currTime",
      },
    });
    const response = await axios.post(
      "https://chat.vdokart.in/chat.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const messageText = {
      message: response.data.content,
      self: false,
    };

    await prisma.messages.create({
      data: {
        userId: data.userId,
        modelId: data.modelId,
        status: "delievered",
        // chatId: 1,
        message_text: messageText,
        // timestamp: "currTime",
      },
    });
    return res.status(200).json(response.data.content);
  } catch (error) {
    console.log(error);
  }
}

async function getMessages(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const response = await prisma.messages.findMany({
      where: {
        userId: 1,
        modelId: id,
      },
    });
    return res.status(200).json(response.map((item) => item.message_text));
  } catch (error) {
    console.log(error);
  }
}

export { createModel, getModels, getModel, storeMessage, getMessages };
