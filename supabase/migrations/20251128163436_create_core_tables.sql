/*
  # Create Core ParentAI Tables

  1. New Tables
    - `profiles` - User profiles with additional metadata
    - `children` - Child information linked to parents
    - `chat_conversations` - AI chat conversation threads
    - `chat_messages` - Individual chat messages
    - `milestones` - Developmental milestones for tracking
    - `daily_insights` - Daily personalized insights for parents
    - `community_questions` - Community Q&A questions
    - `community_answers` - Answers to community questions

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Ensure secure access patterns

  3. Features
    - Timestamps for all records
    - Soft delete support where needed
    - Proper relationships between tables
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text,
  health_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children"
  ON children FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert children"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their children"
  ON children FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversation messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('physical', 'cognitive', 'social', 'language')),
  title text NOT NULL,
  description text,
  age_month_min integer,
  age_month_max integer,
  achieved boolean DEFAULT false,
  achieved_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their children milestones"
  ON milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = milestones.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their children milestones"
  ON milestones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = milestones.child_id
      AND children.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = milestones.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Create daily_insights table
CREATE TABLE IF NOT EXISTS daily_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text CHECK (category IN ('tips', 'milestone', 'health', 'development')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their insights"
  ON daily_insights FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their insights"
  ON daily_insights FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create community_questions table
CREATE TABLE IF NOT EXISTS community_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  views integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON community_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create questions"
  ON community_questions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own questions"
  ON community_questions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create community_answers table
CREATE TABLE IF NOT EXISTS community_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  content text NOT NULL,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view answers"
  ON community_answers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create answers"
  ON community_answers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own answers"
  ON community_answers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON milestones(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_category ON milestones(category);
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_id ON daily_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_community_questions_user_id ON community_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_answers_question_id ON community_answers(question_id);