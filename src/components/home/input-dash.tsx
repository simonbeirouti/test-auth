"use client";

import {useEffect, useState} from "react";
import {createClient} from "@/supabase/client";
import Link from "next/link";

export default function InputDash() {
	const supabase = createClient();
	const [contactValue, setContactValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [isLoggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		(async () => {
			const {data: sessionData, error} = await supabase.auth.getSession();

			if (error) console.error(error);

			if (sessionData.session?.user.id) {
				setLoggedIn(true);
			}
		})();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Add email alias validation
		if (contactValue.includes("+")) {
			alert(
				"Email aliases are not allowed. Please use your main email address."
			);
			setLoading(false);
			return;
		}

		try {
			// Get referral code from URL
			const urlParams = new URLSearchParams(window.location.search);
			const referralCode = urlParams.get("ref");

			// Construct callback URL with referral code
			let u = new URL(
				`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://coin.fi"}/auth/callback`
			);
			if (referralCode) {
				console.timeLog("referalCode", referralCode);
				u.searchParams.set("ref", referralCode);
			}

			// Auth: with OTP
			const {data, error} = await supabase.auth.signInWithOtp({
				email: contactValue,
				options: {
					emailRedirectTo: u.toString(),
				},
			});

			if (error) throw error;

			setSubmitted(true);
		} catch (error) {
			console.error("Error:", error);
			alert(
				error instanceof Error
					? `Error: ${error.message}`
					: "An unexpected error occurred. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="text-center space-y-4">
				<div className="text-emerald-400">
					<p>Magic link sent! Check your email to sign in.</p>
					<p className="text-sm text-emerald-400/60">
						Do not forget to check your spam folder.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			{!isLoggedIn ? (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="relative">
						<input
							type="email"
							placeholder="Enter your email"
							value={contactValue}
							onChange={(e) => {
								const value = e.target.value;
								if (value.includes("+")) {
									e.target.setCustomValidity(
										"Email aliases are not allowed. Please use your main email address."
									);
								} else {
									e.target.setCustomValidity("");
								}
								setContactValue(value);
							}}
							className="w-full px-4 py-3 bg-transparent border border-emerald-400/30 rounded text-emerald-400 placeholder-emerald-400/30 focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
							required
							pattern="^[^+]+@[^+]+\.[a-zA-Z]{2,}$"
							disabled={loading}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full px-6 py-3 text-emerald-400 bg-transparent border border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-black group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="relative flex items-center justify-center gap-2">
							{loading ? (
								<span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
							) : (
								<span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
							)}
							GET EARLY ACCESS
						</span>
					</button>
				</form>
			) : (
				<Link
					href="/dashboard"
					className="block w-full px-6 py-3 text-center text-emerald-400 bg-transparent border border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 rounded"
				>
					Access Dashboard
				</Link>
			)}
		</div>
	);
}
