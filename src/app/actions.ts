"use server";

import {encodedRedirect} from "@/utils/utils";
import {createClient} from "@/supabase/server";
import {headers} from "next/headers";

export const signUpAction = async (formData: FormData) => {
	const email = formData.get("email")?.toString();
	const refCode = formData.get("refCode")?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	if (!email) {
		return encodedRedirect("error", "/", "Email and password are required");
	}

	const {error} = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: `${origin}/auth/callback${refCode ? `?ref=${refCode}` : ""}`,
		},
	});

	if (error) {
		console.error(error.code + " " + error.message);
		return encodedRedirect("error", "/", error.message);
	} else {
		return encodedRedirect(
			"success",
			"/",
			"Thanks for signing up! Please check your email for a verification link."
		);
	}
};