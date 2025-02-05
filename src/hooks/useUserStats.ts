"use client";

import {createClient} from "@/supabase/client";
import {User} from "@/src/types";

const supabase = createClient();

export async function loadActiveChallenges() {
	try {
		const {data: challenges, error: challengesError} = await supabase
			.from("referral_challenges")
			.select("*")
			.order("end_date", {ascending: true});

		if (challengesError) throw challengesError;

		if (!challenges || challenges.length === 0) {
			return [];
		}

		return challenges;
	} catch (err) {
		console.error("Error loading active challenges:", err);
		return [];
	}
}

export async function loadReferralStats(user: User) {
	if (!user) return;

	try {
		const {data: referrals, error: referralsError} = await supabase
			.from("referrals")
			.select("*")
			.eq("referral_code", user.referral_code);

		const totalReferrals = referrals?.length || 0;

		const referral_points =
			referrals?.reduce((acc, curr) => acc + curr.points_awarded, 0) || 0;

		if (referralsError) throw referralsError;

		const result = {
			referralCode: user.referral_code,
			totalReferrals,
			pointsEarned: referral_points,
			// chainSize: 0,
			// shareCount: 0,
		};
		return result;
	} catch (err) {
		console.error("Error loading referral stats:", err);
		throw err;
	}
}

export async function loadRecentShares(userId: string) {
	if (!userId) return;

	try {
		const {data: shares, error: sharesError} = await supabase
			.from("share_activities")
			.select("*")
			.eq("user_id", userId)
			.order("shared_at", {ascending: false})
			.limit(5);

		if (sharesError) throw sharesError;
		return shares || [];
	} catch (err) {
		console.error("Error loading recent shares:", err);
		throw err;
	}
}

export async function loadTopReferrers() {
	try {
		const {data: topReferrers, error} = await supabase
			.from("referral_points") // Use the referral_points view
			.select("referral_code, total_points") // Select referral_code & total_points
			.order("total_points", {ascending: false}) // Order by highest points
			.limit(5); // Limit to top 5 referrers

		if (error) throw error;
		return topReferrers || [];
	} catch (err) {
		console.error("Error loading top referrers:", err);
		throw err;
	}
}
