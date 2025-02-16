/*
  # Update timer states table

  1. Changes
    - Safely check if table exists before creating
    - Add RLS policies if they don't exist
    - Ensure unique constraint on user_id
*/

DO $$ 
BEGIN
  -- Add RLS policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'timer_states' AND policyname = 'Users can read own timer state'
  ) THEN
    ALTER TABLE IF EXISTS timer_states ENABLE ROW LEVEL SECURITY;

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
  END IF;

  -- Ensure the unique constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'timer_states_user_id_key'
  ) THEN
    ALTER TABLE timer_states ADD CONSTRAINT timer_states_user_id_key UNIQUE (user_id);
  END IF;

  -- Ensure last_updated column exists and rename if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'timer_states' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE timer_states RENAME COLUMN updated_at TO last_updated;
  END IF;

END $$;