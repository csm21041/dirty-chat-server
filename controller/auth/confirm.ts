import { type EmailOtpType } from "@supabase/supabase-js";
import createSupabaseClient from "../../utils/client";
function stringOrFirstString(item: string | string[] | undefined) {
  return Array.isArray(item) ? item[0] : item;
}

export default async function confirm(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).appendHeader("Allow", "GET").end();
    return;
  }

  const queryParams = req.query;
  const token_hash = stringOrFirstString(queryParams.token_hash);
  const type = stringOrFirstString(queryParams.type);

  let next = "/error";

  if (token_hash && type) {
    const supabase = createSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });
    if (error) {
      console.error(error);
    } else {
      next = stringOrFirstString(queryParams.next) || "/";
    }
  }

  res.redirect(next);
}
