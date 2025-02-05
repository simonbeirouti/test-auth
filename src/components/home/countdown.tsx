'use client'

import { useState, useEffect } from "react";

export default function Countdown() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const targetDate = new Date("2025-02-21T00:00:00");

		const calculateTimeLeft = () => {
			const now = new Date();
			const difference = targetDate.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex flex-col space-y-2">
			<div className="text-emerald-400/90 text-sm">
				Early access closing in:
			</div>
			<div className="grid grid-cols-4 gap-2 text-center">
				<div className="bg-emerald-400/10 rounded p-2">
					<div className="text-2xl font-bold text-emerald-400">
						{timeLeft.days}
					</div>
					<div className="text-xs text-emerald-400/70">DAYS</div>
				</div>
				<div className="bg-emerald-400/10 rounded p-2">
					<div className="text-2xl font-bold text-emerald-400">
						{timeLeft.hours}
					</div>
					<div className="text-xs text-emerald-400/70">HOURS</div>
				</div>
				<div className="bg-emerald-400/10 rounded p-2">
					<div className="text-2xl font-bold text-emerald-400">
						{timeLeft.minutes}
					</div>
					<div className="text-xs text-emerald-400/70">MINUTES</div>
				</div>
				<div className="bg-emerald-400/10 rounded p-2">
					<div className="text-2xl font-bold text-emerald-400">
						{timeLeft.seconds}
					</div>
					<div className="text-xs text-emerald-400/70">SECONDS</div>
				</div>
			</div>
		</div>
	);
}
