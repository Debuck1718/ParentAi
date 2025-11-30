import React, { useState, useEffect } from 'react';
import { Stethoscope, X, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DoctorNote {
  id: string;
  visit_date: string;
  provider_name: string | null;
  reason: string;
  diagnosis: string | null;
  prescriptions: any[];
  follow_up_date: string | null;
  notes: string | null;
}

interface DoctorNotesProps {
  childId: string;
}

export const DoctorNotes: React.FC<DoctorNotesProps> = ({ childId }) => {
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [providerName, setProviderName] = useState('');
  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [childId]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pediatrician_notes')
      .select('*')
      .eq('child_id', childId)
      .order('visit_date', { ascending: false });

    if (data && !error) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!reason) return;

    setSaving(true);
    const { error } = await supabase
      .from('pediatrician_notes')
      .insert({
        child_id: childId,
        visit_date: visitDate,
        provider_name: providerName || null,
        reason,
        diagnosis: diagnosis || null,
        follow_up_date: followUpDate || null,
        notes: noteText || null,
      });

    if (!error) {
      await fetchNotes();
      setShowModal(false);
      setVisitDate(new Date().toISOString().split('T')[0]);
      setProviderName('');
      setReason('');
      setDiagnosis('');
      setFollowUpDate('');
      setNoteText('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this doctor note?')) {
      await supabase.from('pediatrician_notes').delete().eq('id', id);
      await fetchNotes();
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
        <h3 className="text-xl font-semibold text-gray-900">Pediatrician Notes</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Add Visit Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No doctor notes yet. Keep medical records organized!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-cyan-300 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Stethoscope className="w-5 h-5 text-cyan-600" />
                    <span className="font-bold text-gray-900">
                      {new Date(note.visit_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {note.provider_name && (
                    <p className="text-sm text-gray-600 mb-2">Provider: {note.provider_name}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reason for Visit</p>
                  <p className="text-gray-900">{note.reason}</p>
                </div>

                {note.diagnosis && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnosis</p>
                    <p className="text-gray-900">{note.diagnosis}</p>
                  </div>
                )}

                {note.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
                    <p className="text-gray-700">{note.notes}</p>
                  </div>
                )}

                {note.follow_up_date && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Follow-up Scheduled</p>
                    <p className="text-amber-900">
                      {new Date(note.follow_up_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Visit Note</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Name (Optional)</label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Well-child checkup"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis (Optional)</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g., Healthy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Follow-up Date (Optional)</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Additional details..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                onClick={handleAddNote}
                disabled={!reason || saving}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
