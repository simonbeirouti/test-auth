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
    variant?: 'default' | 'compact';
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
  type: 'success' | 'error' | 'info';
}

export interface ShareModalProps {
  onClose: () => void;
  referralLink: string;
}

export interface CompletionDialogProps {
	time: string;
	onTryAgain: () => void;
	onCustomize: (password: string, bearing: BearingConfig) => void;
}

export interface BearingConfig {
	up: { color: "yellow" | "green" | "blue" | "red"; key: "w" | "s" | "a" | "d" };
	down: { color: "yellow" | "green" | "blue" | "red"; key: "w" | "s" | "a" | "d" };
	left: { color: "yellow" | "green" | "blue" | "red"; key: "w" | "s" | "a" | "d" };
	right: { color: "yellow" | "green" | "blue" | "red"; key: "w" | "s" | "a" | "d" };
}

export interface StepContent {
	title: string;
	description: string;
	fields?: {
		id: string;
		label: string;
		type: "text" | "color" | "key" | "navigation";
		placeholder?: string;
		maxLength?: number;
	}[];
}

export interface MobiusGameProps {
	password: string;
	bearing: BearingConfig;
	startingLevel?: number;
	isTutorial?: boolean;
	onCustomize?: (newPassword: string, newBearing: BearingConfig) => void;
}

export interface Timer {
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export interface ContactFormData {
	firstName: string;
	email: string;
	message: string;
}

export interface EmailTemplateProps {
  firstName: string;
  email: string;
  message: string;
}