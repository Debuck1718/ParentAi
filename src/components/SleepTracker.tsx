import React, { useState, useEffect } from 'react';
import { Moon, X, Loader2, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SleepLog {
  id: string;
  sleep_start: string;
  sleep_end: string | null;
  duration_minutes: number | null;
  sleep_quality: string | null;
  notes: string | null;
}

interface SleepTrackerProps {
  childId: string;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ childId }) => {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sleepStart, setSleepStart] = useState('');
  const [sleepEnd, setSleepEnd] = useState('');
  const [quality, setQuality] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [childId]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('child_id', childId)
      .order('sleep_start', { ascending: false })
      .limit(10);

    if (data && !error) {
      setLogs(data);
    }
    setLoading(false);
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.round((endTime - startTime) / 60000);
  };

  const handleAddLog = async () => {
    if (!sleepStart || !sleepEnd) return;

    const duration = calculateDuration(sleepStart, sleepEnd);

    setSaving(true);
    const { error } = await supabase
      .from('sleep_logs')
      .insert({
        child_id: childId,
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
        duration_minutes: duration,
        sleep_quality: quality || null,
        notes: notes || null,
      });

    if (!error) {
      await fetchLogs();
      setShowModal(false);
      setSleepStart('');
      setSleepEnd('');
      setQuality('');
      setNotes('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this sleep log?')) {
      await supabase.from('sleep_logs').delete().eq('id', id);
      await fetchLogs();
    }
  };

  const getAIInsights = async () => {
    if (logs.length < 3) {
      setInsights('Log at least 3 sleep sessions to get AI insights.');
      return;
    }

    setLoadingInsights(true);
    try {
      const sleepData = logs.map(log =>
        `Start: ${new Date(log.sleep_start).toLocaleString()}, Duration: ${log.duration_minutes} min, Quality: ${log.sleep_quality || 'not rated'}`
      ).join('; ');

      const message = `Sleep logs: ${sleepData}. Provide insights on sleep patterns, average duration, quality trends, and recommendations for better sleep.`;

      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setInsights(data.response || 'Unable to generate insights.');
    } catch (error) {
      setInsights('Unable to generate insights at this time.');
    }
    setLoadingInsights(false);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Sleep Tracking</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Moon className="w-4 h-4" />
          <span>Log Sleep</span>
        </button>
      </div>

      {logs.length > 2 && (
        <div className="mb-6">
          <button
            onClick={getAIInsights}
            disabled={loadingInsights}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {loadingInsights ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get Sleep Insights</span>
              </>
            )}
          </button>

          {insights && (
            <div className="mt-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">AI Sleep Analysis</h4>
              </div>
              <p className="text-sm text-gray-700">{insights}</p>
            </div>
          )}
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No sleep logs yet. Start tracking sleep patterns!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-gray-900">
                      {new Date(log.sleep_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {log.sleep_quality && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.sleep_quality === 'excellent' ? 'bg-green-100 text-green-700' :
                        log.sleep_quality === 'good' ? 'bg-blue-100 text-blue-700' :
                        log.sleep_quality === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.sleep_quality}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Start: {new Date(log.sleep_start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    {log.sleep_end && (
                      <>
                        <p>End: {new Date(log.sleep_end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="font-semibold text-indigo-600">Duration: {formatDuration(log.duration_minutes)}</p>
                      </>
                    )}
                    {log.notes && <p className="text-gray-700 mt-2">{log.notes}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Log Sleep</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep Start</label>
                <input
                  type="datetime-local"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep End</label>
                <input
                  type="datetime-local"
                  value={sleepEnd}
                  onChange={(e) => setSleepEnd(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep Quality (Optional)</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select quality</option>
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleAddLog}
                disabled={!sleepStart || !sleepEnd || saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Log Sleep'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
