import React, { useState, useEffect } from 'react';
import { Syringe, X, Loader2, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VaccineRecord {
  id: string;
  vaccine_name: string;
  scheduled_date: string | null;
  administered_date: string | null;
  next_dose_date: string | null;
  provider: string | null;
  notes: string | null;
}

interface VaccineRecordsProps {
  childId: string;
}

export const VaccineRecords: React.FC<VaccineRecordsProps> = ({ childId }) => {
  const [records, setRecords] = useState<VaccineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vaccineName, setVaccineName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [administeredDate, setAdministeredDate] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [childId]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vaccine_records')
      .select('*')
      .eq('child_id', childId)
      .order('scheduled_date', { ascending: true });

    if (data && !error) {
      setRecords(data);
    }
    setLoading(false);
  };

  const handleAddRecord = async () => {
    if (!vaccineName) return;

    setSaving(true);
    const { error } = await supabase
      .from('vaccine_records')
      .insert({
        child_id: childId,
        vaccine_name: vaccineName,
        scheduled_date: scheduledDate || null,
        administered_date: administeredDate || null,
        provider: provider || null,
        notes: notes || null,
      });

    if (!error) {
      await fetchRecords();
      setShowModal(false);
      setVaccineName('');
      setScheduledDate('');
      setAdministeredDate('');
      setProvider('');
      setNotes('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this vaccine record?')) {
      await supabase.from('vaccine_records').delete().eq('id', id);
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
        <h3 className="text-xl font-semibold text-gray-900">Vaccine Schedule</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Syringe className="w-4 h-4" />
          <span>Add Vaccine</span>
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No vaccine records yet. Start tracking immunizations!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-rose-300 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Syringe className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold text-gray-900">{record.vaccine_name}</span>
                    {record.administered_date && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {record.scheduled_date && (
                      <p className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Scheduled: {new Date(record.scheduled_date).toLocaleDateString()}</span>
                      </p>
                    )}
                    {record.administered_date && (
                      <p className="text-green-700 font-semibold">
                        Administered: {new Date(record.administered_date).toLocaleDateString()}
                      </p>
                    )}
                    {record.provider && <p>Provider: {record.provider}</p>}
                    {record.notes && <p className="text-gray-700 mt-2">{record.notes}</p>}
                  </div>
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
              <h3 className="text-xl font-semibold text-gray-900">Add Vaccine Record</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vaccine Name</label>
                <input
                  type="text"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="e.g., MMR, DTaP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date (Optional)</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Administered Date (Optional)</label>
                <input
                  type="date"
                  value={administeredDate}
                  onChange={(e) => setAdministeredDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provider (Optional)</label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes or reactions..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                onClick={handleAddRecord}
                disabled={!vaccineName || saving}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Add Vaccine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
