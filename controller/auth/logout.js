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
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, client_1.default)();
        try {
            yield supabase.auth.signOut();
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.clearCookie("admin", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return res.status(200).json({ message: "Logout Successfull" });
        }
        catch (error) {
            console.log(error);
            return res.status(411).json({ message: "Logout Error" });
        }
    });
}
exports.default = logout;
