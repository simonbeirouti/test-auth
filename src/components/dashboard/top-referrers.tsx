import {Medal, Trophy} from "lucide-react";
import {createClient} from "@/supabase/server";

export default async function TopReferrers() {
	const supabase = await createClient();

	const fetchTopReferrers = async () => {
		try {
			const referrers = await supabase
				.from("referral_points")
				.select("referral_code, total_points")
				.order("total_points", {ascending: false})
				.limit(10);
			return referrers.data || [];
		} catch (error) {
			console.error("Failed to fetch top referrers:", error);
			return [];
		}
	};

    const topReferrers = await fetchTopReferrers();

    const randomNames = [
        '1a2b3c4d5e', 'f6e5d4c3b2', '9a8b7c6d5e', '1f2e3d4c5b',
        'a1b2c3d4e5', '5e4d3c2b1a', 'b5c4d3e2f1', '2a3b4c5d6e',
        'f1e2d3c4b5', '6d5e4f3a2b'
    ];

    const topReferrersWithRandomNames = topReferrers.map((user, index) => ({
        ...user,
        referral_code: randomNames[index] || `${index + 1}`
    }));

	return (
		<div className="bg-black border border-emerald-400/20 rounded-lg p-4">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-emerald-400 text-xl font-bold">
					Top Referrers
				</h3>
				<Trophy className="w-6 h-6 text-emerald-400" />
			</div>
            <div className="space-y-4 mb-6">
				{topReferrersWithRandomNames?.map(
					(
						user: {referral_code: string; total_points: number},
						index: number
					) => (
						<div
							key={index}
							className="flex items-center justify-between p-3 bg-emerald-400/20 rounded-lg"
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
									<Medal className="w-5 h-5 text-emerald-400" />
								</div>
								<div>
									<div className="text-emerald-400 font-bold">
										{user.referral_code}
									</div>
								</div>
							</div>
							<div className="text-emerald-400 font-bold">
								{user.total_points} points
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
}
