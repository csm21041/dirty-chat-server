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
const client_1 = __importDefault(require("../../utils/client"));
const prisma_client_1 = require("prisma/prisma-client");
function signup(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, client_1.default)();
        if (!supabase)
            return;
        const prisma = new prisma_client_1.PrismaClient();
        try {
            const { name, email, password } = req.body;
            const { data, error } = yield supabase.auth.signUp({
                email,
                password,
            });
            if (error)
                return res.status(411).json({ message: "Not able to make account" });
            yield prisma.user.create({
                data: {
                    username: name,
                    email: email,
                    password: password,
                    tokenbalance: 100,
                },
            });
            console.log(data);
            res.cookie("token", (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return res.status(200).json({ message: "Signup Successfull" });
        }
        catch (error) {
            console.log(error);
            return res.status(411).json({ message: "User unauthorized" });
        }
    });
}
exports.default = signup;
