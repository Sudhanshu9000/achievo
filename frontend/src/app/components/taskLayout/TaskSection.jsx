'use client';

import { useState, useEffect } from 'react';

const TaskSection = ({ onTaskComplete, onStartTask, onStopTask, activeTask, isScreenSharing }) => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const lastUpdated = localStorage.getItem('lastTaskUpdate');
    const today = new Date().toDateString();

    if (savedTasks && lastUpdated === today) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks = [
        { id: 1, text: 'Complete daily meditation', completed: false, points: 50 },
        { id: 2, text: 'Read for 30 minutes', completed: false, points: 50 },
        { id: 3, text: 'Exercise for 20 minutes', completed: false, points: 50 }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('tasks', JSON.stringify(defaultTasks));
      localStorage.setItem('lastTaskUpdate', today);
    }
  }, []);

  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        onTaskComplete && onTaskComplete(tasks.filter(t => t.completed).length + 1, tasks.length);
        const updatedTask = { ...task, completed: true };
        const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTask;
      }
      return task;
    }));
  };

  const handleStartTask = (task) => {
    if (isScreenSharing && activeTask?.id !== task.id) {
      if (window.confirm('Are you sure you want to switch tasks? Your current task will be marked as incomplete.')) {
        onStopTask();
        onStartTask(task);
      }
    } else {
      onStartTask(task);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
        >
          <label className="flex items-center space-x-3 w-full cursor-pointer">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                className="hidden"
                disabled={task.completed}
              />
              <div className={`w-6 h-6 border-2 rounded ${task.completed ? 'bg-black border-black' : 'border-gray-300'} transition-colors duration-200 flex items-center justify-center`}>
                {task.completed && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="text-gray-800 text-lg flex-grow">
              {task.text}
            </span>
            <div className="flex items-center space-x-2">
              {!task.completed && (
                <button
                  onClick={() => handleStartTask(task)}
                  disabled={isScreenSharing && activeTask?.id !== task.id}
                  className={`w-32 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    activeTask?.id === task.id
                      ? 'bg-black hover:bg-gray-800'
                      : 'bg-black hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {activeTask?.id === task.id ? 'In Progress' : 'Start Task'}
                </button>
              )}
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${task.completed ? 'text-black bg-green-200' : 'text-gray-600 bg-gray-100'}`}>
                {task.points} GP
              </span>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default TaskSection; 