import React, { useState, useEffect } from 'react';
import { TrendingUp, X, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GrowthRecord {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
  notes: string | null;
}

interface GrowthTrackerProps {
  childId: string;
}

export const GrowthTracker: React.FC<GrowthTrackerProps> = ({ childId }) => {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [childId]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('growth_records')
      .select('*')
      .eq('child_id', childId)
      .order('measurement_date', { ascending: false });

    if (data && !error) {
      setRecords(data);
    }
    setLoading(false);
  };

  const handleAddRecord = async () => {
    if (!height && !weight && !headCircumference) return;

    setSaving(true);
    const { error } = await supabase
      .from('growth_records')
      .insert({
        child_id: childId,
        measurement_date: measurementDate,
        height_cm: height ? parseFloat(height) : null,
        weight_kg: weight ? parseFloat(weight) : null,
        head_circumference_cm: headCircumference ? parseFloat(headCircumference) : null,
        notes: notes || null,
      });

    if (!error) {
      await fetchRecords();
      setShowModal(false);
      setMeasurementDate(new Date().toISOString().split('T')[0]);
      setHeight('');
      setWeight('');
      setHeadCircumference('');
      setNotes('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this growth record?')) {
      await supabase.from('growth_records').delete().eq('id', id);
      await fetchRecords();
    }
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
        <h3 className="text-xl font-semibold text-gray-900">Growth Charts</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Add Measurement</span>
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No growth records yet. Start tracking development!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-gray-900">
                      {new Date(record.measurement_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {record.height_cm && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-semibold mb-1">Height</p>
                        <p className="text-lg font-bold text-blue-900">{record.height_cm} cm</p>
                      </div>
                    )}
                    {record.weight_kg && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 font-semibold mb-1">Weight</p>
                        <p className="text-lg font-bold text-green-900">{record.weight_kg} kg</p>
                      </div>
                    )}
                    {record.head_circumference_cm && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 font-semibold mb-1">Head</p>
                        <p className="text-lg font-bold text-purple-900">{record.head_circumference_cm} cm</p>
                      </div>
                    )}
                  </div>
                  {record.notes && <p className="text-sm text-gray-700 mt-3">{record.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
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
              <h3 className="text-xl font-semibold text-gray-900">Add Measurement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Measurement Date</label>
                <input
                  type="date"
                  value={measurementDate}
                  onChange={(e) => setMeasurementDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 50.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 3.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Head Circumference (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={headCircumference}
                  onChange={(e) => setHeadCircumference(e.target.value)}
                  placeholder="e.g., 35.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={handleAddRecord}
                disabled={(!height && !weight && !headCircumference) || saving}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Add Measurement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
