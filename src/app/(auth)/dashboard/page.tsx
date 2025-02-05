import { Fragment } from "react";
import {GameElements} from "@/components/dashboard/game-elements";
import {ReferralDashboard} from "@/components/dashboard/referral-dashboard";
import {socialLinks} from "@/src/data";
import {redirect} from "next/navigation";
import {createClient} from "@/supabase/server";
import TopReferrers from "@/components/dashboard/top-referrers";

export default async function DashboardPage() {
	const supabase = await createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/");
	}

	// if (isLoading) {
	// 	return (
	// 		<div className="h-screen flex items-center justify-center text-emerald-400">
	// 			Loading...
	// 		</div>
	// 	);
	// }

	return (
		<Fragment>
			<div className="space-y-6">
				<ReferralDashboard user={user} />
				<GameElements user={user} />
				<TopReferrers />

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
		</Fragment>
	);
}
