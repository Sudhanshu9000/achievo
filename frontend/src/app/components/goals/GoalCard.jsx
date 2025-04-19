'use client'

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function GoalCard({ goal, isSelected, onSelect, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const isCustomGoal = goal.id.startsWith('custom-');

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleMenuOpen() {
      setShowMenu(false);
    }

    document.addEventListener('menuOpen', handleMenuOpen);
    return () => {
      document.removeEventListener('menuOpen', handleMenuOpen);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    document.dispatchEvent(new Event('menuOpen'));
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer p-6 rounded-lg ${
        isSelected 
          ? 'bg-black text-white border-2 border-black' 
          : 'bg-white text-black border-2 border-gray-200 hover:border-black'
      } transition-colors relative`}
    >
      {isCustomGoal && (
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className={`p-2 rounded-full transition-colors ${
              isSelected ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'
            }`}
            title="More options"
          >
            <i className="ri-more-2-fill text-xl"></i>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(goal);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(goal);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-2"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4" onClick={() => onSelect(goal)}>
        <i className={`${goal.icon} text-2xl ${isSelected ? 'text-white' : 'text-black'}`}></i>
        <div>
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          <p className={`text-sm mt-1 ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
            {goal.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 