'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomGoalForm({ onSubmit, onCancel, initialData }) {
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setGoalData({
        title: initialData.title,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!goalData.title.trim()) {
      setError('Please enter a goal title');
      return;
    }

    if (!goalData.description.trim()) {
      setError('Please enter a goal description');
      return;
    }

    onSubmit({
      id: initialData?.id || 'custom-' + Date.now(),
      icon: 'ri-flag-line',
      ...goalData
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border-2 border-black"
    >
      <h3 className="text-xl font-semibold text-black mb-4">
        {initialData ? 'Edit Custom Goal' : 'Create Custom Goal'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            value={goalData.title}
            onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
            placeholder="Enter your goal title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Description
          </label>
          <textarea
            id="description"
            value={goalData.description}
            onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
            placeholder="Describe your goal"
            rows={3}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {initialData ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 