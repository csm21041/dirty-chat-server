"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.storeMessage = exports.getModel = exports.getModels = exports.createModel = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const client_2 = __importDefault(require("../utils/client"));
const fs_1 = __importDefault(require("fs"));
function createModel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const supabase = (0, client_2.default)();
            const formData = req.body;
            const modelData = JSON.parse(formData.data);
            console.log("modelData", modelData);
            const images = req.files;
            images.forEach((image) => __awaiter(this, void 0, void 0, function* () {
                const imagefile = fs_1.default.readFileSync(image.path);
                const { data, error } = yield supabase.storage
                    .from("model_images")
                    .upload(`${modelData.name}/${image.filename}`, imagefile, {
                    upsert: true,
                });
                console.log(data);
                if (error) {
                    console.log(error);
                }
            }));
            fs_1.default.readdir(`./uploads`, (err, files) => {
                if (err)
                    console.log(err);
                files.forEach((file) => {
                    fs_1.default.unlink(`./uploads/${file}`, (err) => {
                        if (err)
                            console.log(err);
                    });
                });
            });
            const profile_images = {};
            for (let i in images) {
                const { data } = supabase.storage
                    .from("model_images")
                    .getPublicUrl(`${modelData.name}/${images[i].filename}`);
                profile_images[`${i}`] = String(data.publicUrl);
            }
            yield prisma.model.create({
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createModel = createModel;
function getModels(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prisma.model.findMany({});
            return res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getModels = getModels;
function getModel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const data = yield prisma.model.findFirst({
                where: {
                    id: id,
                },
            });
            console.log(data);
            return res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getModel = getModel;
function storeMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data);
            // // const currTime = new Date().toLocaleTimeString();
            yield prisma.messages.create({
                data: {
                    userId: data.userId,
                    modelId: data.modelId,
                    status: "delievered",
                    // chatId: 1,
                    message_text: data.message_text,
                    // timestamp: "currTime",
                },
            });
            const response = yield axios_1.default.post("https://chat.vdokart.in/chat.php", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const messageText = {
                message: response.data.content,
                self: false,
            };
            yield prisma.messages.create({
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.storeMessage = storeMessage;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const response = yield prisma.messages.findMany({
                where: {
                    userId: 1,
                    modelId: id,
                },
            });
            return res.status(200).json(response.map((item) => item.message_text));
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getMessages = getMessages;
