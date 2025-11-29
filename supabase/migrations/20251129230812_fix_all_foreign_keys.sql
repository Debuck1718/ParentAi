/*
  # Fix All Foreign Key References to Use auth.users

  1. Changes
    - Update chat_conversations table to reference auth.users(id) directly
    - Update daily_insights table to reference auth.users(id) directly
    - Update community_questions table to reference auth.users(id) directly
    - Update community_answers table to reference auth.users(id) directly
    - This allows all features to work immediately after signup without requiring profiles
  
  2. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Fix chat_conversations foreign key
ALTER TABLE chat_conversations 
  DROP CONSTRAINT IF EXISTS chat_conversations_user_id_fkey;

ALTER TABLE chat_conversations
  ADD CONSTRAINT chat_conversations_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Fix daily_insights foreign key
ALTER TABLE daily_insights 
  DROP CONSTRAINT IF EXISTS daily_insights_user_id_fkey;

ALTER TABLE daily_insights
  ADD CONSTRAINT daily_insights_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Fix community_questions foreign key
ALTER TABLE community_questions 
  DROP CONSTRAINT IF EXISTS community_questions_user_id_fkey;

ALTER TABLE community_questions
  ADD CONSTRAINT community_questions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Fix community_answers foreign key
ALTER TABLE community_answers 
  DROP CONSTRAINT IF EXISTS community_answers_user_id_fkey;

ALTER TABLE community_answers
  ADD CONSTRAINT community_answers_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
