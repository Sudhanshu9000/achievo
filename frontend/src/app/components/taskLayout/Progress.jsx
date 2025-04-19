const Progress = ({ completedTasks = 0, totalTasks = 0 }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-700 font-medium">Today's Progress</span>
        <span className="text-gray-600">{completedTasks}/{totalTasks} tasks</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ 
            width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default Progress; 