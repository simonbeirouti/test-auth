import {Trophy, Award} from "lucide-react";
import {GameElementsProps} from "@/src/types";
import {Milestone} from "./milestone";
import {createClient} from "@/supabase/server";

export async function GameElements({user}: GameElementsProps) {
  const supabase = await createClient();
  
  const {data: dashboardUser} = await supabase
		.from("users")
		.select("*")
		.eq("id", user.id)
    .single();

	const fetchGameElements = async () => {
		try {
			const [
				{data: badges, error: badgesError},
				{data: userBadges, error: userBadgesError},
				{data: milestones, error: milestonesError},
				{data: referrals, error: referralsError},
			] = await Promise.all([
				supabase
					.from("badges")
					.select("*")
					.order("required_referrals", {ascending: true}),
				supabase.from("user_badges").select("*").eq("user_id", user.id),
				supabase
					.from("milestones")
					.select("*")
					.order("target_users", {ascending: true}),
				supabase
					.from("referrals")
					.select("*")
					.eq("referral_code", dashboardUser.referral_code),
			]);

			if (
				badgesError ||
				userBadgesError ||
				milestonesError ||
				referralsError
			) {
				console.error("Error fetching game data:", {
					badgesError,
					userBadgesError,
					milestonesError,
					referralsError,
				});
				return null;
			}

			if (!badges || !userBadges || !milestones || !referrals) {
				console.error("Missing data in response");
				return null;
			}

			return {
				badges,
				userBadges,
				milestones,
				totalUsers: referrals.length
			};
		} catch (err) {
			console.error("Unexpected error during game data fetch:", err);
			return null;
		}
	};

  const gameData = await fetchGameElements();

	const nextBadge = gameData?.badges.find(
		(badge) => badge.required_referrals > (gameData?.totalUsers || 0)
	);

	const nextMilestone = gameData?.milestones.find(
		(milestone) => milestone.target_users > (gameData?.totalUsers || 0)
	);

	return (
		<div className="space-y-6">
			{nextBadge && (
				<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
					<div className="flex items-center gap-4 mb-4">
						<Trophy className="w-8 h-8 text-emerald-400" />
						<div>
							<h3 className="text-lg font-bold text-emerald-400">
								Next Badge: {nextBadge.name}
							</h3>
							<p className="text-emerald-400/70 text-sm">
								{nextBadge.description}
							</p>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex justify-between text-sm text-emerald-400/70">
							<span>{gameData?.totalUsers} referrals</span>
							<span>{nextBadge.required_referrals} needed</span>
						</div>
						<div className="w-full bg-emerald-400/10 rounded-full h-2">
							<div
								className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
								style={{
									width: `${Math.min(((gameData?.totalUsers || 0) / nextBadge.required_referrals) * 100, 100)}%`,
								}}
							></div>
						</div>
					</div>
				</div>
			)}

			{nextMilestone && (
				<Milestone />
			)}

			<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
				<h3 className="text-lg font-bold text-emerald-400 mb-4">
					Your Badges
				</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					{gameData?.badges.map((badge) => {
						const earned =
							gameData?.totalUsers >= badge.required_referrals;
						return (
							<div
								key={badge.id}
								className={`p-4 rounded-lg border ${
									earned
										? "border-emerald-400/40 bg-emerald-400/10"
										: "border-emerald-400/10 bg-emerald-400/5 opacity-50"
								}`}
							>
								<div className="flex items-center gap-3">
									<Award
										className={`w-6 h-6 ${
											earned
												? "text-emerald-400"
												: "text-emerald-400/40"
										}`}
									/>
									<div>
										<div className="font-bold text-emerald-400">
											{badge.name}
										</div>
										<div className="text-xs text-emerald-400/70">
											{earned
												? "Earned!"
												: `${badge.required_referrals} referrals needed`}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
