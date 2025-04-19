'use client';

import { useState, useEffect, useRef } from 'react';
import { pipe } from '@screenpipe/browser';

const ScreenMonitor = ({ taskId, taskText }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [focusLevel, setFocusLevel] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [activeWindow, setActiveWindow] = useState('');
  const [screenData, setScreenData] = useState([]);
  const warningTimeoutRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const streamRef = useRef(null);

  // Screen monitoring
  useEffect(() => {
    let isMounted = true;

    async function startMonitoring() {
      try {
        // Stream in real-time
        for await (const event of pipe.streamVision(true)) {
          if (!isMounted) return;
          
          setScreenData(prev => [...prev, {
            text: event.data.text,
            appName: event.data.app_name,
            timestamp: new Date().toISOString(),
            image: event.data.image
          }].slice(-10)); 

          // Calculate focus score 
          const focusScore = calculateFocusScore(event.data, taskText);
          setFocusLevel(focusScore);

          if (focusScore < 50) {
            setShowWarning(true);
            warningTimeoutRef.current = setTimeout(() => {
              setShowWarning(false);
            }, 5000);
          } else {
            setShowWarning(false);
          }
        }
      } catch (err) {
        console.error('Error monitoring screen:', err);
      }
    }

    if (isMonitoring) {
      startMonitoring();
    }

    return () => {
      isMounted = false;
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMonitoring, taskText]);

  const calculateFocusScore = (screenContent, taskText) => {
    if (!taskText) return 100;

    const keywords = taskText.toLowerCase().split(' ').filter(word => word.length > 3);
    let score = 100;
    let hasTaskContent = false;

    
    if (screenContent.text) {
      const text = screenContent.text.toLowerCase();
      const relevantWords = keywords.filter(keyword => text.includes(keyword));
      const relevanceScore = (relevantWords.length / keywords.length) * 100;
      
      if (relevanceScore > 30) { 
        hasTaskContent = true;
        score = Math.max(score, relevanceScore);
      }
    }

    // If no task found, gradually decrease score
    if (!hasTaskContent) {
      const timeSpent = screenContent.timestamp ? 
        (Date.now() - new Date(screenContent.timestamp).getTime()) / 1000 : 0;
      
      const timePenalty = Math.min(70, timeSpent / 10); 
      score = Math.max(30, 100 - timePenalty);
    }

    return Math.max(0, Math.min(100, score));
  };

  const startMonitoring = async () => {
    try {
      // Request screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      streamRef.current = stream;

      stream.getVideoTracks()[0].onended = () => {
        stopMonitoring();
      };

      setIsMonitoring(true);
    } catch (error) {
      console.error('Error accessing screen:', error);
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setFocusLevel(0);
    setShowWarning(false);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isMonitoring ? stopMonitoring : startMonitoring}
        className={`p-2 rounded-full transition-colors ${
          isMonitoring 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
        title={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMonitoring ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
      </button>

      {isMonitoring && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Focus Level: {focusLevel}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${focusLevel}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 truncate">
            Current Window: {screenData[screenData.length - 1]?.appName || 'Unknown'}
          </div>
        </div>
      )}

      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          Work on Your Task - Time is Precious!
        </div>
      )}
    </div>
  );
};

export default ScreenMonitor; 