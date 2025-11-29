import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Phone } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  description: string;
}

const SYMPTOMS: Symptom[] = [
  { id: '1', name: 'High Fever', description: 'Temperature above 103°F (39.4°C)' },
  { id: '2', name: 'Difficulty Breathing', description: 'Labored or fast breathing' },
  { id: '3', name: 'Severe Rash', description: 'Widespread rash that won\'t fade' },
  { id: '4', name: 'Choking', description: 'Unable to breathe or cry' },
  { id: '5', name: 'Unresponsiveness', description: 'Baby won\'t wake up or respond' },
  { id: '6', name: 'Severe Pain', description: 'Continuous severe crying' },
  { id: '7', name: 'Dehydration', description: 'No wet diapers for 8+ hours' },
  { id: '8', name: 'Seizures', description: 'Convulsions or unusual jerking' },
];

export const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [showAssessment, setShowAssessment] = useState(false);

  const toggleSymptom = (id: string) => {
    const newSymptoms = new Set(selectedSymptoms);
    if (newSymptoms.has(id)) {
      newSymptoms.delete(id);
    } else {
      newSymptoms.add(id);
    }
    setSelectedSymptoms(newSymptoms);
  };

  const getRecommendation = () => {
    if (selectedSymptoms.size === 0) {
      return {
        severity: 'info',
        title: 'Select Symptoms',
        description: 'Please select the symptoms your child is experiencing',
        action: null,
      };
    }

    const severeSymptoms = ['1', '2', '3', '4', '5', '8'];
    const hasSevere = Array.from(selectedSymptoms).some((id) => severeSymptoms.includes(id));

    if (hasSevere) {
      return {
        severity: 'critical',
        title: 'Call Emergency Services Immediately',
        description:
          'Based on the symptoms selected, your child needs immediate emergency medical attention.',
        action: 'Call 911 or your local emergency number',
      };
    }

    if (selectedSymptoms.size >= 3) {
      return {
        severity: 'urgent',
        title: 'Seek Urgent Care',
        description:
          'Your child should be evaluated by a healthcare professional as soon as possible.',
        action: 'Contact your pediatrician or visit an urgent care clinic',
      };
    }

    return {
      severity: 'monitor',
      title: 'Monitor Your Child',
      description:
        'Keep a close watch on your child\'s symptoms and contact your pediatrician if they worsen.',
      action: 'Schedule a doctor\'s appointment if symptoms persist',
    };
  };

  const recommendation = getRecommendation();

  const severityColors: Record<
    string,
    { bg: string; border: string; text: string; icon: string }
  > = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600',
    },
    urgent: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
    },
    monitor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    },
    info: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-900',
      icon: 'text-gray-600',
    },
  };

  const colors = severityColors[recommendation.severity];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Helper</h1>
        <p className="text-gray-600 mb-8">
          Quick guidance for urgent situations. This is not a substitute for professional medical advice.
        </p>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What symptoms is your child experiencing?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.has(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{symptom.name}</h3>
                      <p className="text-sm text-gray-600">{symptom.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
          <div className="flex items-start space-x-4">
            <AlertTriangle className={`w-6 h-6 ${colors.icon} flex-shrink-0 mt-1`} />
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${colors.text} mb-2`}>
                {recommendation.title}
              </h2>
              <p className={`${colors.text} mb-4 opacity-90`}>
                {recommendation.description}
              </p>
              {recommendation.action && (
                <div className="flex items-center space-x-2">
                  <Phone className={`w-5 h-5 ${colors.icon}`} />
                  <span className={`font-semibold ${colors.text}`}>
                    {recommendation.action}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Important Note</h3>
          <p className="text-blue-800 text-sm">
            This tool provides general guidance only. Always trust your instincts as a parent.
            If you believe your child needs emergency care, call emergency services immediately.
            In case of life-threatening emergencies, call 911 (or your local emergency number)
            without delay.
          </p>
        </div>
      </div>
    </div>
  );
};
