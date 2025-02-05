"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Award, Users, Gift } from "lucide-react";
import {
  loadBadges,
  loadUserBadges,
  loadMilestones,
  loadTotalUsers,
} from "@/hooks/useBadgeStats";
import { loadReferralStats } from "@/hooks/useUserStats";
import { GameElementsProps, Badge, MilestoneType, UserBadge } from "@/types";
import { Milestone } from "./milestone";

export function GameElements({ user }: GameElementsProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [milestones, setMilestones] = useState<MilestoneType[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userReferrals, setUserReferrals] = useState(0);

  useEffect(() => {
    if (user) {
      const loadGameElements = async () => {
        try {
          const [
            badgesData,
            userBadgesData,
            milestonesData,
            totalReferredUsers,
            referralStats,
          ] = await Promise.all([
            loadBadges(),
            loadUserBadges(user),
            loadMilestones(),
            loadTotalUsers(),
            loadReferralStats(user),
          ]);

          setBadges(badgesData);
          setUserBadges(userBadgesData as UserBadge[]);
          setMilestones(milestonesData);
          setTotalUsers(totalReferredUsers);
          setUserReferrals(referralStats?.totalReferrals || 0);
        } catch (error) {
          console.error("Error loading game elements:", error);
        }
      };

      loadGameElements();
    }
  }, [user]);

  const nextBadge = badges.find(
    (badge) => badge.required_referrals > userReferrals,
  );
  const nextMilestone = milestones.find(
    (milestone) => milestone.target_users > totalUsers,
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
              <span>{userReferrals} referrals</span>
              <span>{nextBadge.required_referrals} needed</span>
            </div>
            <div className="w-full bg-emerald-400/10 rounded-full h-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (userReferrals / nextBadge.required_referrals) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {nextMilestone && (
        <Milestone milestone={nextMilestone} totalUsers={totalUsers} />
      )}

      <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
        <h3 className="text-lg font-bold text-emerald-400 mb-4">Your Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const earned = userReferrals >= badge.required_referrals;
            // const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
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
                      earned ? "text-emerald-400" : "text-emerald-400/40"
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
