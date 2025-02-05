"use client";

import { createClient } from "@/supabase/client";
import { User } from "@/types";

const supabase = createClient()

export async function loadBadges() {
  try {
    const { data: badgesData, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .order("required_referrals");

    const badges = badgesData || [];

    if (badgesError) throw badgesError;

    return badges;
  } catch (err) {
    console.error("Error loading game elements:", err);
    throw err;
  }
}

export async function loadUserBadges(user: User) {
  if (!user) return;

  try {
    const { data: userBadges, error: userBadgesError } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", user.id);

    if (userBadgesError) throw userBadgesError;

    return userBadges || [];
  } catch (err) {
    console.error("Error loading user badges:", err);
    throw err;
  }
}

export async function loadMilestones() {
  try {
    const { data: milestones, error: milestonesError } = await supabase
      .from("milestones")
      .select("*")
      .order("target_users");

    if (milestonesError) throw milestonesError;

    return milestones || [];
  } catch (err) {
    console.error("Error loading milestones:", err);
    throw err;
  }
}

export async function loadTotalUsers() {
  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("Error loading total referred users:", err);
    throw err;
  }
}
