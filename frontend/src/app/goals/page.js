'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoalCard from '../components/goals/GoalCard';
import CustomGoalForm from '../components/goals/CustomGoalForm';

const AVAILABLE_GOALS = [
  {
    id: 'learning',
    icon: 'ri-book-line',
    title: 'Learning & Skill Development',
    description: 'Focus on acquiring new skills and knowledge in your chosen field.'
  },
  {
    id: 'health',
    icon: 'ri-heart-line',
    title: 'Health & Fitness',
    description: 'Improve physical health, fitness, and maintain a healthy lifestyle.'
  },
  {
    id: 'career',
    icon: 'ri-briefcase-line',
    title: 'Career Growth',
    description: 'Advance your career through professional development and networking.'
  },
  {
    id: 'creativity',
    icon: 'ri-palette-line',
    title: 'Creative Projects',
    description: 'Work on personal creative projects and artistic endeavors.'
  },
  {
    id: 'productivity',
    icon: 'ri-timer-line',
    title: 'Productivity & Organization',
    description: 'Enhance your productivity and organizational skills.'
  }
];

export default function GoalsPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState('');
  const [customGoals, setCustomGoals] = useState([]);

  // Load custom goals and previously selected goal from localStorage
  useEffect(() => {
    const savedCustomGoals = localStorage.getItem('customGoals');
    if (savedCustomGoals) {
      setCustomGoals(JSON.parse(savedCustomGoals));
    }

    const savedGoal = localStorage.getItem('userGoal');
    if (savedGoal) {
      const goal = JSON.parse(savedGoal);
      setSelectedGoal(goal);
    }
  }, []);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setError('');
  };

  const handleCustomGoalSubmit = (customGoal) => {
    if (editingGoal) {
      const updatedCustomGoals = customGoals.map(goal => 
        goal.id === editingGoal.id ? customGoal : goal
      );
      setCustomGoals(updatedCustomGoals);
      localStorage.setItem('customGoals', JSON.stringify(updatedCustomGoals));
      
      if (selectedGoal?.id === editingGoal.id) {
        setSelectedGoal(customGoal);
      }
    } else {
      const updatedCustomGoals = [...customGoals, customGoal];
      setCustomGoals(updatedCustomGoals);
      localStorage.setItem('customGoals', JSON.stringify(updatedCustomGoals));
      setSelectedGoal(customGoal);
    }
    
    setEditingGoal(null);
    setShowCustomForm(false);
  };

  const handleDeleteCustomGoal = (goalToDelete) => {
    const updatedCustomGoals = customGoals.filter(goal => goal.id !== goalToDelete.id);
    setCustomGoals(updatedCustomGoals);
    localStorage.setItem('customGoals', JSON.stringify(updatedCustomGoals));
    if (selectedGoal?.id === goalToDelete.id) {
      setSelectedGoal(null);
    }
  };

  const handleEditCustomGoal = (goalToEdit) => {
    setEditingGoal(goalToEdit);
    setShowCustomForm(true);
  };

  const handleContinue = () => {
    if (!selectedGoal) {
      setError('Please select a goal');
      return;
    }

    localStorage.setItem('userGoal', JSON.stringify(selectedGoal));
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">Choose Your Goal</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {AVAILABLE_GOALS.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isSelected={selectedGoal?.id === goal.id}
                onSelect={handleGoalSelect}
              />
            ))}
          </div>

          {/* Custom Goals Section */}
          {customGoals.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-black mb-4">Your Custom Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    isSelected={selectedGoal?.id === goal.id}
                    onSelect={handleGoalSelect}
                    onDelete={handleDeleteCustomGoal}
                    onEdit={handleEditCustomGoal}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-white py-4">
            {showCustomForm ? (
              <CustomGoalForm
                onSubmit={handleCustomGoalSubmit}
                onCancel={() => {
                  setShowCustomForm(false);
                  setEditingGoal(null);
                }}
                initialData={editingGoal}
              />
            ) : (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-3 px-4 bg-white border-2 border-black rounded-lg text-black font-medium hover:bg-gray-50 transition-colors mb-4"
              >
                Create Custom Goal
              </button>
            )}

            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 