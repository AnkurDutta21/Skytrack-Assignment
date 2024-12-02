import { useState } from 'react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  position: { lat: number; lng: number } | null;
}

const LocationModal = ({ isOpen, onClose, onSave, position }: LocationModalProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
      setName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Location</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter location name"
              required
            />
          </div>
          {position && (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-600">
                Latitude: {position.lat.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600">
                Longitude: {position.lng.toFixed(4)}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal; 