export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  child_id: string;
  category: string;
  title: string;
  description: string;
  achieved: boolean;
  achieved_date?: string;
  created_at: string;
}
