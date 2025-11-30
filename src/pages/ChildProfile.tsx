import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Moon, Utensils, Syringe, TrendingUp, Activity, AlertCircle, BookOpen, Stethoscope, Calendar, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Child } from '../types';

type TabType = 'overview' | 'photos' | 'sleep' | 'feeding' | 'vaccines' | 'growth' | 'milestones' | 'symptoms' | 'activities' | 'doctor';

export const ChildProfile: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChild = async () => {
      if (!childId) return;

      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .maybeSingle();

      if (data && !error) {
        setChild(data);
      }
      setLoading(false);
    };

    fetchChild();
  }, [childId]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();

    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}` : `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Activity },
    { id: 'photos' as TabType, label: 'Photos', icon: Camera },
    { id: 'sleep' as TabType, label: 'Sleep', icon: Moon },
    { id: 'feeding' as TabType, label: 'Feeding', icon: Utensils },
    { id: 'vaccines' as TabType, label: 'Vaccines', icon: Syringe },
    { id: 'growth' as TabType, label: 'Growth', icon: TrendingUp },
    { id: 'milestones' as TabType, label: 'Milestones', icon: Calendar },
    { id: 'symptoms' as TabType, label: 'Symptoms', icon: AlertCircle },
    { id: 'activities' as TabType, label: 'Activities', icon: BookOpen },
    { id: 'doctor' as TabType, label: 'Doctor Notes', icon: Stethoscope },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Child not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{child.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{calculateAge(child.date_of_birth)}</span>
                <span>•</span>
                <span>Born {new Date(child.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {child.gender && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{child.gender}</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {child.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {child.health_notes && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900"><strong>Health Notes:</strong> {child.health_notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-1 px-6 py-4 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab childId={child.id} childName={child.name} />}
            {activeTab === 'photos' && <PhotosTab childId={child.id} />}
            {activeTab === 'sleep' && <SleepTab childId={child.id} />}
            {activeTab === 'feeding' && <FeedingTab childId={child.id} />}
            {activeTab === 'vaccines' && <VaccinesTab childId={child.id} />}
            {activeTab === 'growth' && <GrowthTab childId={child.id} />}
            {activeTab === 'milestones' && <MilestonesTab childId={child.id} />}
            {activeTab === 'symptoms' && <SymptomsTab childId={child.id} />}
            {activeTab === 'activities' && <ActivitiesTab childId={child.id} childDob={child.date_of_birth} />}
            {activeTab === 'doctor' && <DoctorNotesTab childId={child.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ childId: string; childName: string }> = ({ childId, childName }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome to {childName}'s Profile</h2>
      <p className="text-gray-600">
        Track every precious moment and milestone. Use the tabs above to access different tracking features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <Camera className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Photo Journal</h3>
          <p className="text-sm text-gray-600">Capture and organize precious memories with AI-powered tagging</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
          <Moon className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Sleep Tracking</h3>
          <p className="text-sm text-gray-600">Monitor sleep patterns and get personalized recommendations</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <Utensils className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Feeding Tracker</h3>
          <p className="text-sm text-gray-600">Log meals and get nutrition insights from AI</p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-6">
          <Syringe className="w-8 h-8 text-rose-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Vaccine Schedule</h3>
          <p className="text-sm text-gray-600">Track immunizations and get reminders</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <TrendingUp className="w-8 h-8 text-amber-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Growth Charts</h3>
          <p className="text-sm text-gray-600">Monitor height and weight with percentile tracking</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
          <Calendar className="w-8 h-8 text-teal-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Milestones</h3>
          <p className="text-sm text-gray-600">Track developmental achievements with AI insights</p>
        </div>
      </div>
    </div>
  );
};

const PhotosTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Photo Journal</h3>
      <p className="text-gray-600 mb-6">Capture and organize precious memories</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Add Photo</span>
      </button>
    </div>
  );
};

const SleepTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Moon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Sleep Tracking</h3>
      <p className="text-gray-600 mb-6">Monitor sleep patterns and get AI-powered insights</p>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Log Sleep</span>
      </button>
    </div>
  );
};

const FeedingTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Feeding Tracker</h3>
      <p className="text-gray-600 mb-6">Log meals and get nutrition recommendations</p>
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Log Feeding</span>
      </button>
    </div>
  );
};

const VaccinesTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Syringe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Vaccine Schedule</h3>
      <p className="text-gray-600 mb-6">Track immunizations and upcoming appointments</p>
      <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Add Vaccine</span>
      </button>
    </div>
  );
};

const GrowthTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Charts</h3>
      <p className="text-gray-600 mb-6">Track height, weight, and development percentiles</p>
      <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Add Measurement</span>
      </button>
    </div>
  );
};

const MilestonesTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Developmental Milestones</h3>
      <p className="text-gray-600 mb-6">Track your child's developmental progress</p>
      <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        View Milestones
      </button>
    </div>
  );
};

const SymptomsTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Symptom History</h3>
      <p className="text-gray-600 mb-6">Review past health concerns and AI assessments</p>
      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        View History
      </button>
    </div>
  );
};

const ActivitiesTab: React.FC<{ childId: string; childDob: string }> = ({ childId, childDob }) => {
  return (
    <div className="text-center py-12">
      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Developmental Activities</h3>
      <p className="text-gray-600 mb-6">AI-curated activities for your child's age</p>
      <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        Browse Activities
      </button>
    </div>
  );
};

const DoctorNotesTab: React.FC<{ childId: string }> = ({ childId }) => {
  return (
    <div className="text-center py-12">
      <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Pediatrician Notes</h3>
      <p className="text-gray-600 mb-6">Keep all medical visits and prescriptions organized</p>
      <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto">
        <Plus className="w-5 h-5" />
        <span>Add Visit Note</span>
      </button>
    </div>
  );
};
