import {Users, Star, Trophy} from "lucide-react";
import {ReferralDashboardProps} from "@/src/types";
import {createClient} from "@/supabase/server";
import CopyButton from "./copy-button";
import ShareButton from "./share-modal";

export async function ReferralDashboard({user}: ReferralDashboardProps) {
	const supabase = await createClient();

	const fetchUserAndReferrals = async () => {
		try {
			const [
				{data: users, error},
				{data: referrals, error: referralsError},
				{data: challenges, error: challengesError},
			] = await Promise.all([
				supabase.from("users").select("*").eq("id", user.id).single(),
				supabase
					.from("referrals")
					.select("*")
					.eq("referral_code", user.referral_code),
				supabase
					.from("referral_challenges")
					.select("*")
					.order("end_date", {ascending: true}),
			]);

			if (error) {
				console.error("Error fetching user data:", error);
				return null;
			}

			if (referralsError) {
				console.error("Error fetching referrals:", referralsError);
				return null;
			}

			if (challengesError) {
				console.error("Error fetching challenges:", challengesError);
				return null;
			}

			if (!users || !referrals || !challenges) {
				console.error("Missing data in response");
				return null;
			}

			return {users, referrals, challenges};
		} catch (err) {
			console.error("Unexpected error during data fetch:", err);
			return null;
		}
	};

	const userData = await fetchUserAndReferrals();

	const dashUser = userData?.users;
	const referrals = userData?.referrals;
	const challenges = userData?.challenges;

	const referralLink = `${
		process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000"
	}/?ref=${dashUser.referral_code}`;

	const statsItems = [
		{
			icon: Users,
			label: "Total Referrals",
			value: referrals?.length || 0,
		},
		{icon: Star, label: "Points Earned", value: dashUser.points || 0},
	];

	return (
		<div className="space-y-6">
			<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
				<h3 className="text-lg font-bold text-emerald-400 mb-4">
					Share Your Link
				</h3>
				<div className="flex items-center gap-2 mb-4">
					<input
						type="text"
						value={referralLink}
						readOnly
						className="flex-1 bg-black/50 border border-emerald-400/30 rounded px-3 py-2 text-emerald-400/90 text-sm"
					/>
					<CopyButton referralLink={referralLink} />
					<ShareButton referralLink={referralLink} />
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6">
				{statsItems.map(({icon: Icon, label, value}) => (
					<div
						key={label}
						className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4"
					>
						<div className="flex items-center gap-2 mb-2">
							<Icon className="w-5 h-5 text-emerald-400" />
							<div className="text-emerald-400/70 text-sm">
								{label}
							</div>
						</div>
						<div className="text-2xl font-bold text-emerald-400">
							{value}
						</div>
					</div>
				))}
			</div>

			{challenges && challenges.length > 0 && (
				<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
					<h3 className="text-lg font-bold text-emerald-400 mb-4">
						Active Challenges
					</h3>
					<div className="space-y-4">
						{challenges?.map((challenge: any) => (
							<div
								key={challenge.id}
								className="bg-emerald-400/10 rounded-lg p-4"
							>
								<div className="flex items-center gap-3 mb-2">
									<Trophy className="w-6 h-6 text-emerald-400" />
									<div>
										<h4 className="font-bold text-emerald-400">
											{challenge.title}
										</h4>
										<p className="text-sm text-emerald-400/70">
											{challenge.description}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between text-sm text-emerald-400/60 mt-2">
									<span>
										{challenge.min_referrals} referrals
										needed
									</span>
									<span>
										{challenge.reward_multiplier}x rewards
									</span>
								</div>
								<div className="mt-2 text-xs text-emerald-400/50">
									Ends in{" "}
									{new Date(
										challenge.end_date
									).toLocaleDateString()}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
