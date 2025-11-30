import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, TrendingUp, AlertCircle, Users, Plus, LogOut, ChevronRight, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Child } from '../types';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const [childrenRes, insightsRes] = await Promise.all([
          supabase.from('children').select('*').eq('user_id', user.id),
          supabase.from('daily_insights').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
        ]);

        if (!childrenRes.error && childrenRes.data) {
          setChildren(childrenRes.data);
        }
        if (!insightsRes.error && insightsRes.data) {
          setInsights(insightsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Get instant answers to parenting questions',
      color: 'from-blue-500 to-blue-600',
      href: '/chat',
    },
    {
      icon: TrendingUp,
      title: 'Milestone Tracker',
      description: 'Track your child\'s developmental milestones',
      color: 'from-green-500 to-green-600',
      href: '/milestones',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Helper',
      description: 'Quick guidance for urgent situations',
      color: 'from-red-500 to-red-600',
      href: '/emergency',
    },
    {
      icon: Users,
      title: 'Community Q&A',
      description: 'Ask questions and help other parents',
      color: 'from-purple-500 to-purple-600',
      href: '/community',
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <nav className="nav-bar">
        <div className="container-main">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ParentAI
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container-main py-12">
        <div className="mb-12 animate-fade-in">
          <h2 className="heading-2 mb-2">
            Welcome back, {user?.full_name || 'Parent'}!
          </h2>
          <p className="text-gray-600 text-lg">
            Your AI co-pilot for every parenting journey
          </p>
        </div>

        {children.length === 0 && (
          <div className="card-base p-6 mb-8 border-l-4 border-l-blue-500 animate-slide-left">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Get started with your first child</h3>
                <p className="text-gray-600 text-sm">
                  Add your child's information to unlock personalized guidance and milestone tracking.
                </p>
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="btn-primary flex items-center space-x-2 ml-4 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Add Child</span>
              </button>
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div className="mb-12 animate-slide-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Children</h3>
            <div className="card-grid-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="card-base p-4 group hover:border-blue-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{child.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(child.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/child/${child.id}`)}
                    className="text-blue-600 text-xs font-semibold hover:text-blue-700 mt-3 flex items-center space-x-1 group-hover:space-x-2 transition-all"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => navigate('/onboarding')}
                className="card-base p-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-semibold text-gray-700">Add Another Child</span>
              </button>
            </div>
          </div>
        )}

        {insights.length > 0 && (
          <div className="mb-12 animate-slide-right">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Daily Insights</span>
            </h3>
            <div className="card-grid gap-6">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="card-base p-6 group hover:border-amber-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge-info text-xs">{insight.category || 'Tips'}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {insight.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {insight.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Features</h3>
          <div className="card-grid-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.title}
                  onClick={() => navigate(feature.href)}
                  className="card-hover group relative overflow-hidden p-6"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-all`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-left">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-2 text-left">{feature.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
