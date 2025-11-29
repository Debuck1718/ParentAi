import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  answers: number;
  likes: number;
  timestamp: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'How to handle separation anxiety in toddlers?',
    content:
      'My 18-month-old has severe separation anxiety and cries whenever I leave the room...',
    author: 'Sarah M.',
    answers: 12,
    likes: 45,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Best sleep schedule for a 6-month-old',
    content:
      'Trying to establish a consistent sleep routine. What has worked for others?...',
    author: 'Mike T.',
    answers: 8,
    likes: 32,
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    title: 'Dealing with picky eaters',
    content:
      'My 3-year-old refuses to eat anything except pasta. Any suggestions?...',
    author: 'Emma L.',
    answers: 15,
    likes: 58,
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    title: 'When should I start potty training?',
    content:
      'Signs to look for and tips that have worked for other parents?...',
    author: 'John D.',
    answers: 20,
    likes: 67,
    timestamp: '8 hours ago',
  },
];

export const Community: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    const question: Question = {
      id: String(questions.length + 1),
      title: newQuestion.title,
      content: newQuestion.content,
      author: 'You',
      answers: 0,
      likes: 0,
      timestamp: 'just now',
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', content: '' });
    setShowAskForm(false);
  };

  const toggleLike = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, likes: q.likes + 1 } : q
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Q&A</h1>
          <p className="text-gray-600 mb-4">
            Ask questions, share experiences, and learn from other parents
          </p>
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
        </div>

        {showAskForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask the Community</h2>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="What would you like to ask?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Provide more details about your question..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowAskForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {question.title}
                </h2>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {question.content}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>by {question.author}</span>
                <span>{question.timestamp}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
                <button
                  onClick={() => toggleLike(question.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{question.likes}</span>
                </button>

                <div className="flex items-center space-x-1 text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>{question.answers} answers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
