import React, { useState, useEffect } from 'react';
import { Utensils, X, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FeedingLog {
  id: string;
  feeding_type: string;
  amount: string | null;
  duration_minutes: number | null;
  food_items: string[];
  notes: string | null;
  fed_at: string;
}

interface FeedingTrackerProps {
  childId: string;
}

export const FeedingTracker: React.FC<FeedingTrackerProps> = ({ childId }) => {
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedingType, setFeedingType] = useState('breastfeeding');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [notes, setNotes] = useState('');
  const [fedAt, setFedAt] = useState(new Date().toISOString().slice(0, 16));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [childId]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .eq('child_id', childId)
      .order('fed_at', { ascending: false })
      .limit(20);

    if (data && !error) {
      setLogs(data);
    }
    setLoading(false);
  };

  const handleAddLog = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('feeding_logs')
      .insert({
        child_id: childId,
        feeding_type: feedingType,
        amount: amount || null,
        duration_minutes: duration ? parseInt(duration) : null,
        food_items: foodItems ? foodItems.split(',').map(item => item.trim()) : [],
        notes: notes || null,
        fed_at: fedAt,
      });

    if (!error) {
      await fetchLogs();
      setShowModal(false);
      setAmount('');
      setDuration('');
      setFoodItems('');
      setNotes('');
      setFedAt(new Date().toISOString().slice(0, 16));
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this feeding log?')) {
      await supabase.from('feeding_logs').delete().eq('id', id);
      await fetchLogs();
    }
  };

  const getFeedingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      breastfeeding: 'bg-pink-100 text-pink-700',
      bottle: 'bg-blue-100 text-blue-700',
      solid_food: 'bg-green-100 text-green-700',
      snack: 'bg-yellow-100 text-yellow-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
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
        <h3 className="text-xl font-semibold text-gray-900">Feeding Tracker</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Utensils className="w-4 h-4" />
          <span>Log Feeding</span>
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No feeding logs yet. Start tracking meals!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Utensils className="w-4 h-4 text-green-600" />
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getFeedingTypeColor(log.feeding_type)}`}>
                      {log.feeding_type.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(log.fed_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {log.amount && <p>Amount: {log.amount}</p>}
                    {log.duration_minutes && <p>Duration: {log.duration_minutes} minutes</p>}
                    {log.food_items && log.food_items.length > 0 && (
                      <p>Foods: {log.food_items.join(', ')}</p>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Log Feeding</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Feeding Type</label>
                <select
                  value={feedingType}
                  onChange={(e) => setFeedingType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="breastfeeding">Breastfeeding</option>
                  <option value="bottle">Bottle</option>
                  <option value="solid_food">Solid Food</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input
                  type="datetime-local"
                  value={fedAt}
                  onChange={(e) => setFedAt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {(feedingType === 'bottle' || feedingType === 'solid_food') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (Optional)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 4 oz, 1 cup"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {feedingType === 'breastfeeding' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes, Optional)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {(feedingType === 'solid_food' || feedingType === 'snack') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Food Items (Optional)</label>
                  <input
                    type="text"
                    value={foodItems}
                    onChange={(e) => setFoodItems(e.target.value)}
                    placeholder="Separate with commas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={handleAddLog}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Log Feeding'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
