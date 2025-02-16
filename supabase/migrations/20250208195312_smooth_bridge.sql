/*
  # Create daily results table

  1. New Tables
    - `daily_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `total_work_time` (integer)
      - `total_break_time` (integer)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `daily_results` table
    - Add policies for authenticated users to:
      - Read their own data
      - Insert their own data
      - Update their own data
*/

CREATE TABLE daily_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  total_work_time integer NOT NULL,
  total_break_time integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily results"
  ON daily_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily results"
  ON daily_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily results"
  ON daily_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);