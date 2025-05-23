"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/middlewares/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(" error:", error);
    return { success: false, message: "Invalid email or password" };
  }
  revalidatePath("/", "layout");
  redirect("/cloude/home/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const formObj = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const fullName = formData.get("fullName");

  const { data, error: signupError } = await supabase.auth.signUp(formObj);

  if (signupError) {
    console.log("Signup error:", signupError);
    return { success: false, message: signupError.message };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      display_name: fullName,
    },
  });

  if (updateError) {
    console.log("Error updating auth.usertable:", updateError);
    return { success: false, message: "Failed to update user profile." };
  }

  const userId = data.user?.id;

  if (userId) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        email: formObj.email,
        full_name: fullName,
        user_id: userId,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.log("Error inserting user into users table:", insertError);
      return { success: false, message: "Failed to create user record." };
    }
  }
  revalidatePath("/", "layout");
  redirect("/cloude/home/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/cloude/auth/sign-in");
}
