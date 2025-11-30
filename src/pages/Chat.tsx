import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, RotateCcw, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const FALLBACK_RESPONSES = [
  "That's a great question! Here are some expert tips on this topic...",
  "Based on child development research, here's what I recommend...",
  "Many parents face this challenge. Let me share some proven strategies...",
  "This is an important concern. Here's what pediatricians suggest...",
];

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeConversation = async () => {
      if (!user) return;
      try {
        const res = await supabase
          .from('chat_conversations')
          .insert({ user_id: user.id, title: 'New Conversation' })
          .select()
          .single();

        if (!res.error && res.data) {
          setConversationId(res.data.id);
        }
      } catch (err) {
        console.error('Error creating conversation:', err);
      }
    };

    initializeConversation();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: currentInput,
      });

      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: conversationHistory
        })
      });

      let aiContent: string;

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Edge function error:', errorData);
        if (errorData.useFallback) {
          aiContent = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] +
            '\n\n(Note: AI service temporarily unavailable. Using fallback responses.)';
        } else {
          throw new Error('Failed to get AI response');
        }
      } else {
        const data = await response.json();
        aiContent = data.response;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage.content,
      });
    } catch (err) {
      console.error('Error:', err);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] +
          '\n\n(Note: Unable to reach AI service. Please try again later.)',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="nav-bar">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="heading-2">AI Chat Assistant</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 container-main py-8 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="heading-2 mb-2">Start a conversation</h2>
              <p className="text-gray-600">Ask anything about parenting and child development</p>
            </div>
          </div>
        )}

        <div className="space-y-6 pb-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={message.role === 'user' ? 'message-user' : 'message-assistant'}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="message-assistant">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-soft"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-soft"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-soft"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="container-main py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a parenting question..."
              disabled={loading}
              className="input-base flex-1 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">For medical emergencies, consult a professional</p>
        </div>
      </div>
    </div>
  );
};
