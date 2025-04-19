'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { calculateLevel } from '../utils/levelUtils'; 

const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
  const [userPoints, setUserPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('userPoints')) || 0;
    }
    return 0;
  });
  const [rewardHistory, setRewardHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('rewardHistory')) || [];
    }
    return [];
  });

  // Save points to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPoints', userPoints.toString());
    }
  }, [userPoints]);

  // Save reward history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rewardHistory', JSON.stringify(rewardHistory));
    }
  }, [rewardHistory]);

  const currentUserLevel = useMemo(() => calculateLevel(userPoints), [userPoints]);

  // Function to add a new reward to history
  const addReward = (points, source, description) => {
    const newReward = {
      id: Date.now(),
      points,
      source,
      description,
      date: new Date().toISOString()
    };
    setRewardHistory(prev => [newReward, ...prev]);
  };

  const value = useMemo(() => ({
    userPoints,
    setUserPoints, 
    currentUserLevel,
    rewardHistory,
    addReward
  }), [userPoints, currentUserLevel, rewardHistory]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 