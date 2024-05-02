import { PrismaClient, Model } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";
import createSupabaseClient from "../utils/client";
import fs from "fs";

interface ModelData {
  name: string;
  attributes: string[];
  description: string;
  parameters: string[];
  profile_images: string[];
}

interface ImageData {
  filename: string;
  path: string;
}

interface ModelInfo {
  parameters: {
    max_tokens: number;
    temperature: string;
    topK: string;
    topP: string;
    frequencyPenalty: string;
    presencePenalty: string;
    repetitionPenalty: string;
    stop: string;
  };
}

interface MessageData {
  userId: string;
  modelId: string;
  max_tokens: number;
  message_text: { role: string; content: string };
}

const prisma = new PrismaClient();

async function createModel(req: Request, res: Response) {
  if (req.method !== "POST")
    return res.json({ message: ` ${req.method} Request  is not allowed` });
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
    const finalResult = await prisma.model.create({
      data: {
        name: modelData.name,
        attributes: modelData.attributes,
        description: modelData.description,
        parameters: modelData.parameters,
        profile_images: profile_images,
      },
    });
    return res.status(200).json({ data: finalResult });
  } catch (error) {
    console.log(error);
  }
}

async function getModels(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const data: Model[] = await prisma.model.findMany({});
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function getModel(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: `${req.method} Request is not allowed` });
  try {
    const id = req.params.id;
    const data: Model | null = await prisma.model.findFirst({
      where: {
        id: id,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function storeMessage(req: Request, res: Response) {
  if (req.method !== "POST")
    return res.json({ message: `${req.method} Request is not allowed` });
  try {
    const data: MessageData = req.body;
    const modelInfo: any = await prisma.model.findFirst({
      where: {
        id: data.modelId,
      },
    });
    const api_data = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: modelInfo.parameters.system_prompt },
        { role: "user", content: data.message_text.content },
      ],

      systemRole: modelInfo.parameters.system_prompt,
      max_tokens: Number(modelInfo?.parameters.max_new_tokens) || 512,
      temperature: Number(modelInfo?.parameters.temperature) || 0.8,
      top_p: Number(modelInfo?.parameters.top_p) || 0.9,
      num_responses: 1,
      top_k: Number(modelInfo?.parameters.top_k) || 0,
      repetition_penalty: Number(modelInfo?.parameters.repetition_penalty) || 1,
      stop: [],
      presence_penalty: Number(modelInfo?.parameters.presence_penalty) || 0,
      frequency_penalty: Number(modelInfo?.parameters.frequency_penalty) || 0,
      webhook: null,
      stream: false,
    };
    const result = await axios.post(`${process.env.API_END_POINT}`, api_data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const messageText = {
      role: "assistant",
      content: result.data.choices[0].message.content,
    };

    await prisma.$transaction([
      prisma.messages.create({
        data: {
          userId: data.userId,
          modelId: data.modelId,
          status: "delievered",
          message_text: data.message_text,
        },
      }),
      prisma.messages.create({
        data: {
          userId: data.userId,
          modelId: data.modelId,
          status: "delievered",
          message_text: messageText,
        },
      }),
      prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          tokenbalance: {
            decrement: 1,
          },
        },
      }),
    ]);
    return res.status(200).json({ message: messageText.content });
  } catch (error) {
    console.log(error);
  }
}

async function getMessages(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const mid = req.params.mid;
    const uid = req.params.uid;
    const response = await prisma.messages.findMany({
      where: {
        userId: uid,
        modelId: mid,
      },
    });
    return res.status(200).json(response.map((item) => item.message_text));
  } catch (error) {
    console.log(error);
  }
}

async function deleteModel(req: Request, res: Response) {
  if (req.method !== "DELETE")
    return res.json({ message: `${req.method} Request is not allowed` });
  try {
    const id = req.params.id;
    await prisma.model.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
}

async function deleteChat(req: Request, res: Response) {
  if (req.method !== "DELETE")
    return res.json({ message: `${req.method} Request is not allowed` });
  try {
    const mid = req.params.mid;
    const uid = req.params.uid;
    await prisma.messages.deleteMany({
      where: {
        userId: uid,
        modelId: mid,
      },
    });
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
}

async function getToken(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const uid = req.params.uid;
    const response = await prisma.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        tokenbalance: true,
      },
    });
    return res.status(200).json({ token: response?.tokenbalance });
  } catch (error) {
    console.log(error);
  }
}

async function getUsers(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const response = await prisma.user.findMany({});
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
}

async function getUserInfo(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const id = req.params.id;
    const response = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
}
async function requestToken(req: Request, res: Response) {
  if (req.method !== "POST")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    console.log(req.body);
    const tokenreq = parseInt(req.body.tokenreq);
    const currtoken = parseInt(req.body.currtoken);
    const id = req.params.id;
    await prisma.token_Request.create({
      data: {
        userId: id,
        requested_tokens: tokenreq,
        status: "pending",
      },
    });
    return res.status(200).json({ message: "Request Completed Successfully" });
  } catch (error) {
    console.log(error);
  }
}
async function getTokenRequests(req: Request, res: Response) {
  if (req.method !== "GET")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const response = await prisma.token_Request.findMany({
      take: 10,
      where: {
        status: "pending",
      },
      include: {
        user: true,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).send("Unable to fetch the requests");
  }
}

async function deleteUser(req: Request, res: Response) {
  if (req.method !== "DELETE")
    return res.json({ message: ` ${req.method} Request is not allowed` });
  try {
    const id = req.params.id;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
}

export {
  createModel,
  getModels,
  getModel,
  storeMessage,
  getMessages,
  deleteModel,
  deleteChat,
  getToken,
  getUsers,
  getUserInfo,
  deleteUser,
  requestToken,
  getTokenRequests,
};
