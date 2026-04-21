import React, { useState, useEffect } from 'react';
import FieldForm from './FieldForm';
import FieldsList from './FieldsList';
import api from './api';

const Dashboard = ({ user }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const res = await api.get('/fields');
      setFields(res.data);
    } catch (err) {
      console.error('Error fetching fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchFields();

  const isAdmin = user.role === 'ADMIN';

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {isAdmin ? 'All Fields Dashboard' : 'My Fields Dashboard'}
        </h2>
        <div className="flex gap-4">
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              + New Field
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>

      {showForm && isAdmin && (
        <FieldForm
          onClose={() => {
            setShowForm(false);
            setEditingField(null);
          }}
          editingField={editingField}
          onSave={fetchFields}
        />
      )}

      <div className="stats bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat">
            <div className="stat-title">Total Fields</div>
            <div className="stat-value">{fields.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Active</div>
            <div className="stat-value text-green-600">{fields.filter(f => f.status === 'Active').length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">At Risk</div>
            <div className="stat-value text-yellow-600">{fields.filter(f => f.status === 'At Risk').length}</div>
          </div>
        </div>
      </div>

      <FieldsList
        fields={fields}
        isAdmin={isAdmin}
        onEdit={(field) => {
          setEditingField(field);
          setShowForm(true);
        }}
        onDelete={fetchFields}
        onUpdate={fetchFields}
      />
    </div>
  );
};

export default Dashboard;
