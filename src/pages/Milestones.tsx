import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

interface Milestone {
  id: string;
  category: string;
  title: string;
  description: string;
  achieved: boolean;
}

const MILESTONE_CATEGORIES = [
  {
    name: 'Physical',
    color: 'blue',
    milestones: [
      { id: '1', title: 'Holds head up', description: '2-3 months' },
      { id: '2', title: 'Rolls over', description: '4-6 months' },
      { id: '3', title: 'Sits without support', description: '6 months' },
      { id: '4', title: 'Crawls', description: '8-10 months' },
      { id: '5', title: 'Walks', description: '12-15 months' },
    ],
  },
  {
    name: 'Cognitive',
    color: 'green',
    milestones: [
      { id: '6', title: 'Recognizes faces', description: '2-3 months' },
      { id: '7', title: 'Responds to their name', description: '6-9 months' },
      { id: '8', title: 'Understands object permanence', description: '8-12 months' },
      { id: '9', title: 'Points at objects', description: '12-15 months' },
    ],
  },
  {
    name: 'Social',
    color: 'purple',
    milestones: [
      { id: '10', title: 'Social smile', description: '2-3 months' },
      { id: '11', title: 'Laughs out loud', description: '3-4 months' },
      { id: '12', title: 'Shows affection', description: '6-12 months' },
      { id: '13', title: 'Waves goodbye', description: '12-15 months' },
    ],
  },
  {
    name: 'Language',
    color: 'pink',
    milestones: [
      { id: '14', title: 'Coos and babbles', description: '2-4 months' },
      { id: '15', title: 'Says "mama" and "dada"', description: '6-12 months' },
      { id: '16', title: 'First words', description: '12-18 months' },
      { id: '17', title: 'Two-word phrases', description: '18-24 months' },
    ],
  },
];

export const Milestones: React.FC = () => {
  const navigate = useNavigate();
  const [achieved, setAchieved] = useState<Set<string>>(new Set());

  const toggleMilestone = (id: string) => {
    const newAchieved = new Set(achieved);
    if (newAchieved.has(id)) {
      newAchieved.delete(id);
    } else {
      newAchieved.add(id);
    }
    setAchieved(newAchieved);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Developmental Milestones</h1>
        <p className="text-gray-600 mb-8">
          Track your child's growth across physical, cognitive, social, and language development
        </p>

        <div className="space-y-8">
          {MILESTONE_CATEGORIES.map((category) => {
            const colors = getColorClasses(category.color);
            return (
              <div key={category.name} className="bg-white rounded-lg shadow p-6">
                <h2 className={`text-xl font-bold mb-4 ${colors.text}`}>{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.milestones.map((milestone) => {
                    const isAchieved = achieved.has(milestone.id);
                    return (
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isAchieved
                            ? `${colors.bg} border-green-500 ${colors.border}`
                            : `border-gray-200 hover:border-gray-300`
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isAchieved
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {isAchieved && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Progress Summary</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(achieved.size / (MILESTONE_CATEGORIES.reduce((acc, cat) => acc + cat.milestones.length, 0))) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-900">
              {achieved.size} / {MILESTONE_CATEGORIES.reduce((acc, cat) => acc + cat.milestones.length, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
