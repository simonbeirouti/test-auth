/*
  # Advanced Referral Program Features
  1. New Tables
    - `referral_challenges`
      - Time-limited referral competitions
      - Tracks special rewards and multipliers
  2. Security
    - Enable RLS 
    - Add policies for challenge participation
    - Seed initial challenges
*/
-- Create referral challenges table
CREATE TABLE IF NOT EXISTS referral_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  reward_multiplier numeric(4,2) DEFAULT 1.0,
  min_referrals integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE referral_challenges ENABLE ROW LEVEL SECURITY;
-- Policies for referral challenges
CREATE POLICY "Challenges are visible to all users"
  ON referral_challenges
  FOR SELECT
  TO authenticated
  USING (true);
-- Insert initial challenges
INSERT INTO referral_challenges (
  title,
  description,
  start_date,
  end_date,
  reward_multiplier,
  min_referrals
) VALUES
  (
    'Early Bird Challenge',
    'Earn 2x points on all referrals this week!',
    now(),
    now() + interval '7 days',
    2.0,
    3
  ),
  (
    'Weekend Warriors',
    'Refer 5 friends this weekend for bonus rewards',
    now() + interval '3 days',
    now() + interval '5 days',
    1.5,
    5
  );
  