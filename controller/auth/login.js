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
function login(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, client_1.default)();
        const prisma = new prisma_client_1.PrismaClient();
        let user = null;
        try {
            const { email, password, isAdmin } = req.body;
            if (isAdmin) {
                user = yield prisma.admin.findFirst({
                    where: {
                        email: email,
                        password: password,
                    },
                });
                if (user == null)
                    return res.status(403).json({ message: "Invalid Credentials" });
                else
                    res.cookie("admin", true, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
            }
            else {
                user = yield prisma.user.findFirst({
                    where: {
                        email: email,
                        password: password,
                    },
                });
                if (user == null)
                    return res.status(403).json({ message: "Invalid Credentials" });
            }
            const supabaseuser = yield supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (supabaseuser == null)
                return res.status(403).json({ message: "Invalid Credentials" });
            res.cookie("token", (_a = supabaseuser.data.session) === null || _a === void 0 ? void 0 : _a.access_token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            console.log(user);
            return res.status(200).json({ message: user === null || user === void 0 ? void 0 : user.id });
        }
        catch (error) {
            console.log(error);
            return res.status(411).json({ message: "User unauthorized", error: error });
        }
    });
}
exports.default = login;
