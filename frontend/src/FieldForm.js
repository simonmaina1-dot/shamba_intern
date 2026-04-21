import React, { useState, useEffect } from 'react';
import api from './api';

const stages = ['Planted', 'Growing', 'Ready', 'Harvested'];

const FieldForm = ({ editingField, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    plantingDate: '',
    currentStage: 'Planted',
    notes: ''
  });

  useEffect(() => {
    if (editingField) {
      setFormData({
        name: editingField.name,
        cropType: editingField.cropType,
        plantingDate: editingField.plantingDate.split('T')[0], // YYYY-MM-DD
        currentStage: editingField.currentStage,
        notes: editingField.notes
      });
    }
  }, [editingField]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingField ? `/fields/${editingField.id}` : '/fields';
      const method = editingField ? 'put' : 'post';
      
      await api[method.toUpperCase()](url, {
        ...formData,
        agentId: editingField?.agentId || 2 // Default agent for new (from seed)
      });
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {editingField ? 'Edit Field' : 'New Field'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Field Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Crop Type</label>
            <input
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Planting Date</label>
            <input
              name="plantingDate"
              type="date"
              value={formData.plantingDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">Current Stage</label>
            <select
              name="currentStage"
              value={formData.currentStage}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Any observations..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
            >
              {editingField ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldForm;

