import React, { useState, useEffect } from 'react';
import { Camera, X, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Photo {
  id: string;
  photo_url: string;
  caption: string;
  ai_tags: string[];
  date_taken: string;
  created_at: string;
}

interface PhotoJournalProps {
  childId: string;
}

export const PhotoJournal: React.FC<PhotoJournalProps> = ({ childId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [childId]);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('photo_journal')
      .select('*')
      .eq('child_id', childId)
      .order('date_taken', { ascending: false });

    if (data && !error) {
      setPhotos(data);
    }
    setLoading(false);
  };

  const handleAddPhoto = async () => {
    if (!photoUrl) return;

    setSaving(true);
    const { error } = await supabase
      .from('photo_journal')
      .insert({
        child_id: childId,
        photo_url: photoUrl,
        caption: caption || null,
        date_taken: dateTaken,
      });

    if (!error) {
      await fetchPhotos();
      setShowModal(false);
      setPhotoUrl('');
      setCaption('');
      setDateTaken(new Date().toISOString().split('T')[0]);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this photo?')) {
      await supabase.from('photo_journal').delete().eq('id', id);
      await fetchPhotos();
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
        <h3 className="text-xl font-semibold text-gray-900">Photo Journal</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No photos yet. Start capturing memories!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative">
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Photo'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Photo';
                }}
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="p-4">
                {photo.caption && (
                  <p className="text-sm text-gray-900 mb-2">{photo.caption}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(photo.date_taken).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Photo</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Caption (Optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Taken</label>
                <input
                  type="date"
                  value={dateTaken}
                  onChange={(e) => setDateTaken(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAddPhoto}
                disabled={!photoUrl || saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Saving...' : 'Add Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
