export interface User {
  id: string;
  email: string;
  points: number;
  referral_code: string;
}

export interface MilestoneType {
  id: string;
  title: string;
  description: string;
  target_users: number;
  reward_description: string;
}

export interface MilestoneProps {
  milestone: MilestoneType;
  totalUsers: number;
  variant?: "default" | "compact";
}

export interface GameElementsProps {
  user: User;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  required_referrals: number;
  created_at?: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface ReferralStats {
  totalReferrals: number;
  pointsEarned: number;
  referralCode: string;
  chainSize: number;
  shareCount: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reward_multiplier: number;
  min_referrals: number;
}

export interface ShareActivity {
  platform: string;
  points_earned: number;
  shared_at: string;
}

export interface ReferralDashboardProps {
  user: User;
}

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

export interface ShareModalProps {
  onClose: () => void;
  referralLink: string;
}
