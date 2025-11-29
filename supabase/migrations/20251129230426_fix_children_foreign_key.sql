/*
  # Fix Children Table Foreign Key

  1. Changes
    - Drop existing children table foreign key constraint
    - Update children table to reference auth.users(id) directly instead of profiles(user_id)
    - This allows children records to be created immediately after signup without requiring a profile record
  
  2. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Drop the existing foreign key constraint
ALTER TABLE children 
  DROP CONSTRAINT IF EXISTS children_user_id_fkey;

-- Add new foreign key constraint pointing to auth.users
ALTER TABLE children
  ADD CONSTRAINT children_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
