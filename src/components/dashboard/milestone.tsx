import {Users, Gift} from "lucide-react";
import {MilestoneProps} from "@/types";

export function Milestone({milestone, totalUsers}: MilestoneProps) {
	return (
		<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
			<div className="flex items-center gap-4 mb-4">
				<Users className="w-8 h-8 text-emerald-400" />
				<div>
					<h3 className="text-lg font-bold text-emerald-400">
						{milestone.title}
					</h3>
					<p className="text-emerald-400/70 text-sm">
						{milestone.description}
					</p>
				</div>
			</div>
			<div className="space-y-2">
				<div className="flex justify-between text-sm text-emerald-400/70">
					<span>{totalUsers} users</span>
					<span>{milestone.target_users.toLocaleString()} goal</span>
				</div>
				<div className="w-full bg-emerald-400/10 rounded-full h-2">
					<div
						className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
						style={{
							width: `${(totalUsers / milestone.target_users) * 100}%`,
						}}
					></div>
				</div>
			</div>
			<div className="mt-4 flex items-center gap-2 text-emerald-400/60 text-sm">
				<Gift className="w-4 h-4" />
				<span>Reward: {milestone.reward_description}</span>
			</div>
		</div>
	);
}
