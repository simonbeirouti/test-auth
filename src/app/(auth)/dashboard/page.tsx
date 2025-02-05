"use client";

import {useEffect, useState} from "react";
import {GameElements} from "@/components/dashboard/game-elements";
import {ReferralDashboard} from "@/components/dashboard/referral-dashboard";
import {Trophy, Medal} from "lucide-react";
import {socialLinks} from "@/data";
import {loadTopReferrers} from "@/hooks/useUserStats";
import {useRouter} from "next/navigation";
import {createClient} from "@/supabase/client";
import {User} from "@/types";

export default function DashboardPage() {
	const router = useRouter();
	const supabase = createClient();
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User>();
	const [topReferrers, setTopReferrers] = useState<any>([]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const {
					data: {user},
					error,
				} = await supabase.auth.getUser();
				if (error) throw error;
				if (!user) throw new Error("User not logged in");

				// Move URL parsing inside useEffect to ensure it only runs client-side
				const ref = typeof window !== 'undefined' 
					? new URL(window.location.href).searchParams.get("ref")
					: null;

				// Check if user exists in DB
				let {data: users, error: userError} = await supabase
					.from("users")
					.select("*")
					.eq("id", user.id);
				if (userError) throw userError;
				if (users && users.length > 0) {
					setUser(users[0]); // Existing user
				} else {
					// New user - insert into `users` table
					const newReferralCode = Math.random()
						.toString(36)
						.substring(2, 8)
						.toUpperCase();

					const {data: newUser, error: insertError} = await supabase
						.from("users")
						.insert([
							{
								id: user.id,
								email: user.email,
								points: 0,
								referral_code: newReferralCode,
							},
						])
						.select()
						.single();

					if (insertError) throw insertError;
					setUser(newUser);

					if (ref) {
						await supabase.from("referrals").insert([
							{
								referral_code: ref,
								// points_awarded: 100, // Ensures 100 points are granted
							},
						]);
					}
				}
				// }
			} catch (error) {
				console.error(error);
				setTimeout(() => {
					router.push("/");
				}, 5000);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	// Fetch top referrers
	useEffect(() => {
		const fetchTopReferrers = async () => {
			try {
				const referrers = await loadTopReferrers();
				const processedReferrers = referrers.map((referrer: any) => ({
					username: `${Math.random()
						.toString(36)
						.substring(2, 16)
						.toUpperCase()}`,
					points: referrer.total_points,
				}));
				setTopReferrers(processedReferrers);
			} catch (error) {
				console.error("Failed to load top referrers:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTopReferrers();
	}, []);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center text-emerald-400">
				Loading...
			</div>
		);
	}

	if (!user) {
		return router.push("/");
	}

	return (
		<>
			<div className="space-y-6">
				<ReferralDashboard user={user} />
				<GameElements user={user} />
			</div>

			<div className="grid grid-cols-1 gap-6 mt-6">
				<div className="bg-black border border-emerald-400/20 rounded-lg p-4">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-emerald-400 text-xl font-bold">
							Top Referrers
						</h3>
						<Trophy className="w-6 h-6 text-emerald-400" />
					</div>
					<div className="space-y-4 mb-6">
						{topReferrers.map(
							(
								user: {username: string; points: number},
								index: number
							) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-emerald-400/5 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
											<Medal className="w-5 h-5 text-emerald-400" />
										</div>
										<div>
											<div className="text-emerald-400 font-bold">
												{user.username}
											</div>
										</div>
									</div>
									<div className="text-emerald-400 font-bold">
										{user.points} points
									</div>
								</div>
							)
						)}
					</div>
				</div>

				<div className="bg-black border border-emerald-400/20 rounded-lg p-4">
					<h3 className="text-emerald-400 text-xl font-bold mb-4">
						Our Socials!
					</h3>
					<p className="text-emerald-400/70 mb-6">
						Join us via our different channels and chat with us!
					</p>
					<div className="flex gap-4 justify-center mb-6 cursor-pointer">
						{socialLinks.map((social, i) => (
							<a
								key={i}
								target="_blank"
								rel="noopener noreferrer"
								className="text-emerald-400/70 hover:text-emerald-400 transition-colors duration-300 p-2"
							>
								<social.icon className="w-8 h-8" />
							</a>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
