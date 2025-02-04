/*
  # Gamification Features for Referral System
  1. New Tables
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `required_referrals` (integer)
      - `created_at` (timestamp)
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `badge_id` (uuid, foreign key)
      - `earned_at` (timestamp)
    - `milestones`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `target_users` (integer)
      - `reward_description` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for badge and milestone visibility
*/
-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  required_referrals integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  badge_id uuid REFERENCES badges(id) NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  target_users integer NOT NULL,
  reward_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
-- Policies for badges
CREATE POLICY "Badges are visible to all users"
  ON badges
  FOR SELECT
  TO authenticated
  USING (true);
-- Policies for user_badges
CREATE POLICY "Users can see their own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
-- Policies for milestones
CREATE POLICY "Milestones are visible to all users"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (true);
-- Insert initial badges
INSERT INTO badges (name, description, image_url, required_referrals) VALUES
  ('Early Pioneer', 'First to join the revolution', '/badges/pioneer.svg', 1),
  ('Rising Star', 'Successfully referred 5 friends', '/badges/star.svg', 5),
  ('Community Champion', 'Built a network of 10 referrals', '/badges/champion.svg', 10),
  ('Elite Ambassador', 'Achieved 25 successful referrals', '/badges/ambassador.svg', 25),
  ('Legendary Leader', 'Created a community of 50 members', '/badges/legendary.svg', 50);
-- Insert initial milestones
INSERT INTO milestones (title, description, target_users, reward_description) VALUES
  ('Early Access', 'First 1,000 users get exclusive features', 1000, 'Premium features unlocked'),
  ('Community Launch', 'Reaching 5,000 active users', 5000, 'Special NFT drop for all members'),
  ('Mass Adoption', 'Growing to 15,000 users', 15000, 'Advanced platform features'),
  ('Global Impact', 'Building a community of 50,000', 50000, 'Governance token distribution');