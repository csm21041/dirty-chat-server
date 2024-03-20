"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
function createSupabaseClient() {
    var _a, _b;
    const url = (_a = process.env.SUPABASE_URL) !== null && _a !== void 0 ? _a : "";
    const api = (_b = process.env.SUPABASE_API) !== null && _b !== void 0 ? _b : "";
    if (url === "" || api === "") {
        throw new Error("No url or api key found for supabase");
    }
    const supabase = (0, supabase_js_1.createClient)(url, api);
    return supabase;
}
exports.default = createSupabaseClient;
