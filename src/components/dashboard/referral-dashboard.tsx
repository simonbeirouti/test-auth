"use client";

import React, { useEffect, useState } from "react";
import { Copy, Share2, Users, Star, TrendingUp, Trophy } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/shared/toast";
import { ShareModal } from "./share-modal";
import {
  loadActiveChallenges,
  loadReferralStats,
} from "@/hooks/useUserStats";
import { ReferralDashboardProps, Challenge } from "@/types";

export function ReferralDashboard({ user }: ReferralDashboardProps) {
  const { toast, showToast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pointsEarned: 0,
  });
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataError(null);
      try {
        const [challenges, stats] = await Promise.all([
          loadActiveChallenges(),
          loadReferralStats(user),
        ]);
        setActiveChallenges(challenges);
        setReferralStats(stats || { totalReferrals: 0, pointsEarned: 0 });
      } catch (err) {
        setDataError(
          err instanceof Error ? err.message : "Failed to load data",
        );
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const refCode = user?.referral_code;

  if (!refCode) {
    return (
      <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-emerald-400 mb-4">
          Welcome to CoinFi!
        </h3>
        <p className="text-emerald-400/70">
          Your referral dashboard is loading.
        </p>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/?ref=${refCode}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast("Copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy link", "error");
    }
  };

  if (dataError) {
    return (
      <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400">
        {dataError}
      </div>
    );
  }

  const statsItems = [
    {
      icon: Users,
      label: "Total Referrals",
      value: referralStats?.totalReferrals,
    },
    { icon: Star, label: "Points Earned", value: referralStats?.pointsEarned },
    // { icon: TrendingUp, label: 'Network Size', value: stats.chainSize },
    // { icon: Share2, label: 'Total Shares', value: stats.shareCount },
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
          <button
            onClick={copyReferralLink}
            className="p-2 hover:bg-emerald-400/10 rounded transition-colors duration-300"
            title="Copy link"
          >
            <Copy className="w-5 h-5 text-emerald-400" />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 hover:bg-emerald-400/10 rounded transition-colors duration-300"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-emerald-400" />
          </button>
        </div>

        {/* {recentShares.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-bold text-emerald-400/70 mb-2">Recent Shares</h4>
            <div className="space-y-2">
              {recentShares.map((share, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-emerald-400/60">{share.platform}</span>
                  <span className="text-emerald-400">+{share.points_earned} points</span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {statsItems.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-emerald-400" />
              <div className="text-emerald-400/70 text-sm">{label}</div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{value}</div>
          </div>
        ))}
      </div>

      {activeChallenges.length > 0 && (
        <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">
            Active Challenges
          </h3>
          <div className="space-y-4">
            {activeChallenges.map((challenge: any) => (
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
                  <span>{challenge.min_referrals} referrals needed</span>
                  <span>{challenge.reward_multiplier}x rewards</span>
                </div>
                <div className="mt-2 text-xs text-emerald-400/50">
                  Ends in {new Date(challenge.end_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          referralLink={refCode}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
