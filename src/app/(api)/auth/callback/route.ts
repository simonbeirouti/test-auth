import {createClient} from "@/supabase/server";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const refCode = requestUrl.searchParams.get("ref");
	const origin = requestUrl.origin;
	const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

	if (code) {
		const supabase = await createClient();
		const {
			data: {user},
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error("Error exchanging code for session:", error);
			return NextResponse.redirect(`${origin}/error`);
		}

		if (user) {
			const newReferralCode = Math.random()
				.toString(36)
				.substring(2, 8)
				.toUpperCase();

			const {error: userError} = await supabase.from("users").insert([
				{
					email: user.email,
					points: 0,
					referral_code: newReferralCode,
				},
			]);

			if (userError) {
				console.error("Error creating user:", userError);
			}

			if (refCode) {
				const {error: referralError} = await supabase
					.from("referrals")
					.insert({
						referral_code: refCode,
					});

				if (referralError) {
					console.error("Error processing referral:", referralError);
				}
			}
		}
	}

	if (redirectTo) {
		return NextResponse.redirect(`${origin}${redirectTo}`);
	}

	return NextResponse.redirect(`${origin}/dashboard`);
}
