CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE,
  phone text UNIQUE,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  referral_code text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex')
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
-- Add policy for initial signup
CREATE POLICY "Authenticated can create a user"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create referrals table to track referral relationships
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) DEFAULT auth.uid(),
  referral_code text NOT NULL REFERENCES users(referral_code),
  points_awarded integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);


-- Enable RLS for referrals table
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read referrals
CREATE POLICY select_referrals ON referrals
FOR SELECT USING (true);

-- Allow users to insert referrals for themselves only
CREATE POLICY insert_referrals ON referrals
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Prevent updates (by not creating an update policy)

-- Create function to override points_awarded value
CREATE OR REPLACE FUNCTION enforce_referral_points()
RETURNS TRIGGER AS $$
BEGIN
  NEW.points_awarded := 100;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the function to a trigger
CREATE TRIGGER set_referral_points
BEFORE INSERT ON referrals
FOR EACH ROW
EXECUTE FUNCTION enforce_referral_points();


-- Create view to summarize referral points by referral code
CREATE OR REPLACE VIEW referral_points AS
SELECT 
    r.referral_code,
    SUM(r.points_awarded) AS total_points
FROM 
    referrals r
GROUP BY 
    r.referral_code;

-- Enable Row-Level Security (RLS) on the referrals table
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;