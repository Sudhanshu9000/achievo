'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/taskLayout/Navbar';
import Progress from '../components/taskLayout/Progress';
import TaskSection from '../components/taskLayout/TaskSection';
import QuotesPage from '../components/taskLayout/QuotesPage';
import MonthlyChallenge from '../components/taskLayout/MonthlyChallenge';
import { useUser } from '@/context/UserContext';
import { generateTasks } from '@/utils/groqApi';

export default function TasksPage() {
  const { userPoints, setUserPoints, currentUserLevel, addReward } = useUser();
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(3);
  const [completedMonthlyTasks, setCompletedMonthlyTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [focusScore, setFocusScore] = useState(100);
  const [warningCount, setWarningCount] = useState(0);
  const [lastWarningTime, setLastWarningTime] = useState(null);
  const [currentWindow, setCurrentWindow] = useState('');
  const [lastWindowTitle, setLastWindowTitle] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const videoRef = useRef(null);
  const totalMonthlyTasks = 50;
  const pointsPerDailyTask = 50;
  const router = useRouter();

  // Monitor focus when screen sharing is active
  useEffect(() => {
    let isMounted = true;
    let checkInterval;

    function startMonitoring() {
      try {
        const windowTitle = document.title;
        setCurrentWindow(windowTitle);
        const newFocusScore = calculateFocusScore(windowTitle, lastWindowTitle);
        setFocusScore(newFocusScore);
        setLastWindowTitle(windowTitle);

        // Show warning based on focus score
        if (newFocusScore < 50) {
          handleFocusWarning(newFocusScore, windowTitle);
        } else {
          setShowWarning(false);
          setWarningMessage('');
        }
      } catch (err) {
        console.error('Error monitoring focus:', err);
      }
    }

    if (isScreenSharing && activeTask) {
      startMonitoring();
      checkInterval = setInterval(startMonitoring, 5000);
    }

    return () => {
      isMounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [isScreenSharing, activeTask, lastWindowTitle]);

  const calculateFocusScore = (windowTitle, lastWindow) => {
    let score = 100;

    if (windowTitle !== lastWindow && lastWindow) {
      score = Math.max(0, score - 10); 
    }

    return score;
  };

  const handleFocusWarning = (newFocusScore, windowTitle) => {
    const now = new Date();
    if (!lastWarningTime || (now - lastWarningTime) > 60000) {
      setWarningCount(prev => prev + 1);
      setLastWarningTime(now);

      if (warningCount >= 2) {
        stopScreenShare();
        alert('⚠️ Task stopped due to inactivity. Please focus on your assigned task: ' + activeTask.text);
      } else {
        alert('⚠️ Warning: Please focus on your task: ' + activeTask.text);
      }
    }
  };

  const startScreenShare = async (task) => {
    try {
      setLastWindowTitle('');
      setFocusScore(100); 
      
      // Request screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: false
      });

      setIsScreenSharing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        };
      }

      setActiveTask(task);
      setWarningCount(0);
      setLastWarningTime(null);

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      return true;
    } catch (err) {
      console.error('Error sharing screen:', err);
      alert('Failed to start screen sharing. Please make sure you have the necessary permissions.');
      return false;
    }
  };

  const stopScreenShare = () => {
    setIsScreenSharing(false);
    setActiveTask(null);
    setLastWindowTitle('');
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const savedMonthlyProgress = localStorage.getItem('monthlyProgress');
    if (savedMonthlyProgress) {
      setCompletedMonthlyTasks(parseInt(savedMonthlyProgress));
    }
  }, []);
  const generateNewTasks = async (goal) => {
    setIsLoading(true);
    const generatedTasks = await generateTasks(goal);
    localStorage.setItem('tasks', JSON.stringify(generatedTasks));
    localStorage.setItem('lastTaskUpdate', new Date().toDateString());
    setTotalTasks(generatedTasks.length);
    setCompletedTasks(0); 
    setIsLoading(false);
  };

  useEffect(() => {
    const loadTasks = async () => {
      const userGoal = localStorage.getItem('userGoal');
      const lastTaskUpdate = localStorage.getItem('lastTaskUpdate');
      const today = new Date().toDateString();

      if (userGoal) {
        const goal = JSON.parse(userGoal);
        const savedGoal = localStorage.getItem('savedGoal');
        
        // Check if goal has changed
        if (!savedGoal || savedGoal !== userGoal) {
          // Goal has changed, generate new tasks
          await generateNewTasks(goal);
          localStorage.setItem('savedGoal', userGoal);
        } else if (!lastTaskUpdate || lastTaskUpdate !== today) {
          // Same goal but new day, generate new tasks
          await generateNewTasks(goal);
        } else {
          // Same goal and same day, use existing tasks
          console.log('Using existing tasks for today');
          const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
          setTotalTasks(savedTasks.length);
          setCompletedTasks(savedTasks.filter(task => task.completed).length);
          setIsLoading(false);
        }
      } else {
        // If no goal is set, redirect to goals page
        router.push('/goals');
      }
    };

    loadTasks();
  }, [router]);

  const handleTaskComplete = (completed, total) => {
    const tasksJustCompleted = completed - completedTasks;
    
    if (tasksJustCompleted > 0) {
      setCompletedTasks(completed);
      setTotalTasks(total);
      const pointsEarned = tasksJustCompleted * pointsPerDailyTask;
      setUserPoints(prevPoints => prevPoints + pointsEarned);
      addReward(pointsEarned, 'Daily Task', `Completed ${tasksJustCompleted} daily task${tasksJustCompleted > 1 ? 's' : ''}`);
      setCompletedMonthlyTasks(prevMonthly => {
        const newMonthly = Math.min(prevMonthly + tasksJustCompleted, totalMonthlyTasks);
        localStorage.setItem('monthlyProgress', newMonthly.toString());
        return newMonthly;
      });
    }
  };

  useEffect(() => {
    if (completedMonthlyTasks === totalMonthlyTasks) {
      const monthlyReward = 2000;
      setUserPoints(prevPoints => prevPoints + monthlyReward);
      addReward(monthlyReward, 'Monthly Challenge', 'Completed monthly challenge');
    }
  }, [completedMonthlyTasks, totalMonthlyTasks, setUserPoints, addReward]);

  const allDailyTasksCompleted = completedTasks === totalTasks;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userLevel={currentUserLevel} userPoints={userPoints} />
      
      <main className="pt-16 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Today's Tasks</h1>
            <button
              onClick={() => router.push('/goals')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            >
              <span>Change Goal</span>
            </button>
          </div>

          {allDailyTasksCompleted ? (
            <QuotesPage />
          ) : (
            <Progress completedTasks={completedTasks} totalTasks={totalTasks} />
          )}

          {/* Screen Share Display */}
          {isScreenSharing && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
              <div className="relative w-full" style={{ height: '500px', backgroundColor: '#000' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          focusScore > 70 ? 'bg-green-500' :
                          focusScore > 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${focusScore}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-black">
                    Focus: {focusScore}%
                  </span>
                </div>
                {warningCount > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Warnings: {warningCount}/2
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <TaskSection 
              onTaskComplete={handleTaskComplete} 
              onStartTask={startScreenShare}
              onStopTask={stopScreenShare}
              activeTask={activeTask}
              isScreenSharing={isScreenSharing}
            />
          </div>

          <MonthlyChallenge 
            completedMonthlyTasks={completedMonthlyTasks} 
            totalMonthlyTasks={totalMonthlyTasks} 
          />
        </div>
      </main>
    </div>
  );
} 