import React from 'react';
import api from './api';

const statusColors = {
  Active: 'bg-green-100 text-green-800 border-green-300',
  'At Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Completed: 'bg-gray-100 text-gray-800 border-gray-300'
};

const FieldsList = ({ fields, isAdmin, onEdit, onDelete, onUpdate }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/fields/${id}`);
        onDelete();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleStageChange = async (field) => {
    const newStage = prompt(`New stage for ${field.name}:`, field.currentStage);
    if (newStage && ['Planted', 'Growing', 'Ready', 'Harvested'].includes(newStage)) {
      await api.put(`/fields/${field.id}`, { currentStage: newStage, notes: field.notes });
      onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-green-50 to-blue-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">Name</th>
            <th className="p-4 text-left font-semibold text-gray-700">Crop</th>
            <th className="p-4 text-left font-semibold text-gray-700">Planted</th>
            <th className="p-4 text-left font-semibold text-gray-700">Stage</th>
            <th className="p-4 text-left font-semibold text-gray-700">Status</th>
            <th className="p-4 text-left font-semibold text-gray-700">Notes</th>
            <th className="p-4 text-left font-semibold text-gray-700">Agent</th>
            {isAdmin && <th className="p-4 text-left font-semibold text-gray-700">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{field.name}</td>
              <td className="p-4">{field.cropType}</td>
              <td className="p-4">{new Date(field.plantingDate).toLocaleDateString()}</td>
              <td className="p-4">{field.currentStage}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[field.status] || 'bg-gray-100 text-gray-800'}`}>
                  {field.status}
                </span>
              </td>
              <td className="p-4 max-w-xs truncate" title={field.notes}>{field.notes || '-'}</td>
              <td className="p-4">{field.agent?.name || 'Unassigned'}</td>
              {isAdmin && (
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStageChange(field)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Update Stage"
                    >
                      Edit Stage
                    </button>
                    <button
                      onClick={() => onEdit(field)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(field.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {fields.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No fields yet{isAdmin ? '. Create one above!' : '.'}
        </div>
      )}
    </div>
  );
};

export default FieldsList;
