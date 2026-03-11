import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Briefcase } from 'lucide-react';
import api from '../utils/axios';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableExperiences, setEditableExperiences] = useState([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Fetch all experiences from backend
  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experiences');
      setExperiences(res.data);
      setEditableExperiences(res.data);
    } catch (err) {
      console.error('Failed to fetch experiences', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes in form inputs
  const handleFieldChange = (id, field, value) => {
    setEditableExperiences(prev =>
      prev.map(exp => {
        if (exp.id === id) {
          if (field === 'isCurrent') {
            return {
              ...exp,
              isCurrent: value,
              endDate: value ? null : exp.endDate || new Date().toISOString().split('T')[0]
            };
          }
          return { ...exp, [field]: value };
        }
        return exp;
      })
    );
  };

  // Validate before saving
  const validateExperience = (exp) => {
    if (!exp.role?.trim()) return 'Role cannot be empty';
    if (!exp.company?.trim()) return 'Company cannot be empty';
    if (!exp.startDate) return 'Start date is required';
    if (!exp.isCurrent && !exp.endDate) return 'End date is required if not current';
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      if (end < start) return 'End date cannot be before start date';
    }
    return null;
  };

  // Format date for backend (ISO string)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date)) return null;
    return date.toISOString();
  };

  // Save experience (PUT for existing)
  const saveExperience = async (id) => {
    const exp = editableExperiences.find(e => e.id === id);
    if (!exp) return;

    const error = validateExperience(exp);
    if (error) {
      alert(`Cannot save experience: ${error}`);
      return;
    }

    const payload = {
      id: exp.id,
      role: exp.role.trim(),
      company: exp.company.trim(),
      startDate: formatDateForAPI(exp.startDate),
      endDate: exp.isCurrent ? null : formatDateForAPI(exp.endDate),
      isCurrent: exp.isCurrent,
      description: exp.description || '',
      orderIndex: exp.orderIndex || 0
    };

    try {
      const res = await api.put(`/experiences/${id}`, payload);
      setExperiences(prev => prev.map(e => (e.id === id ? res.data : e)));
      setEditableExperiences(prev => prev.map(e => (e.id === id ? res.data : e)));
    } catch (err) {
      console.error('Failed to save experience', err);
      alert('Failed to save experience');
    }
  };

  // Add new experience (POST)
  const addExperience = async () => {
    const newExp = {
      role: 'New Role',
      company: 'Company Name',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      isCurrent: false,
      description: '',
      orderIndex: experiences.length + 1
    };

    try {
      const res = await api.post('/experiences', newExp); // backend returns numeric ID
      setExperiences(prev => [...prev, res.data]);
      setEditableExperiences(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add experience', err);
      alert('Failed to add experience');
    }
  };

  // Delete experience
  const deleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await api.delete(`/experiences/${id}`);
      setExperiences(prev => prev.filter(e => e.id !== id));
      setEditableExperiences(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete experience');
    }
  };

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Briefcase className="text-primary" /> Manage Experience
        </h1>
        <button onClick={addExperience} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Experience
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center p-10 text-gray-400">Loading experiences...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center p-10 glass-card text-gray-400">
            No experience records found.
          </div>
        ) : (
          editableExperiences.map(exp => (
            <div key={exp.id} className="glass-card p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <input
                    className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-primary focus:outline-none"
                    type="text"
                    value={exp.role}
                    onChange={e => handleFieldChange(exp.id, 'role', e.target.value)}
                    placeholder="Role"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company</label>
                  <input
                    className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-primary focus:outline-none"
                    type="text"
                    value={exp.company}
                    onChange={e => handleFieldChange(exp.id, 'company', e.target.value)}
                    placeholder="Company"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    className="bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-primary focus:outline-none"
                    type="date"
                    value={formatDateForInput(exp.startDate)}
                    onChange={e => handleFieldChange(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    className={`bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-primary focus:outline-none ${
                      exp.isCurrent ? 'opacity-50' : ''
                    }`}
                    type="date"
                    value={formatDateForInput(exp.endDate)}
                    onChange={e => handleFieldChange(exp.id, 'endDate', e.target.value)}
                    disabled={exp.isCurrent}
                  />
                </div>
                <label className="flex items-center gap-2 text-gray-300 mt-6">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={e => handleFieldChange(exp.id, 'isCurrent', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Current Position</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  className="w-full bg-gray-800 text-gray-300 p-2 rounded border border-gray-700 focus:border-primary focus:outline-none"
                  value={exp.description || ''}
                  onChange={e => handleFieldChange(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows="4"
                />
              </div>

              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => saveExperience(exp.id)}
                  className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded transition-colors"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageExperience;