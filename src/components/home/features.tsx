"use client";

import {useState} from "react";
import {features} from "@/src/data";

export default function Features() {
	const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-4">
				{features.map((feature, i) => (
					<div
						key={i}
						className={`p-4 border border-emerald-400/20 rounded-lg bg-emerald-400/5 hover:bg-emerald-400/10 transition-all duration-300 cursor-pointer ${
							selectedFeature === i
								? "ring-2 ring-emerald-400"
								: ""
						}`}
						onClick={() =>
							setSelectedFeature(selectedFeature === i ? null : i)
						}
					>
						<feature.icon className="w-6 h-6 text-emerald-400 mb-2" />
						<h3 className="text-emerald-400 font-bold mb-1">
							{feature.title}
						</h3>
						<p className="text-emerald-400/70 text-sm">
							{feature.desc}
						</p>
						{selectedFeature === i && (
							<div className="mt-4 text-xs text-emerald-400/60 border-t border-emerald-400/20 pt-4">
								{feature.details}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
