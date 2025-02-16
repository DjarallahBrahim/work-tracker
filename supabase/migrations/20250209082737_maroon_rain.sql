/*
  # Add timer states table

  1. New Tables
    - `timer_states`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `work_time` (integer)
      - `break_time` (integer)
      - `status` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their timer state
*/

CREATE TABLE timer_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  work_time integer NOT NULL DEFAULT 0,
  break_time integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE timer_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own timer state"
  ON timer_states
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timer state"
  ON timer_states
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timer state"
  ON timer_states
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);