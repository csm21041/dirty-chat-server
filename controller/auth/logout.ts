import createSupabaseClient from "../../utils/client";
export default async function logout(req: any, res: any) {
  const supabase = createSupabaseClient();

  try {
    await supabase.auth.signOut();
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.clearCookie("admin", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    console.log(error);
    return res.status(411).json({ message: "Logout Error" });
  }
}
