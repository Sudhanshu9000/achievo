const MonthlyChallenge = ({ completedMonthlyTasks = 0, totalMonthlyTasks = 50 }) => {
  const progressPercentage = totalMonthlyTasks > 0 
    ? (completedMonthlyTasks / totalMonthlyTasks) * 100 
    : 0;

  const monthlyReward = 2000;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full mt-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-black">Monthly Challenge</h3>
        <span className="text-sm font-semibold text-green-500 bg-black px-2.5 py-1 rounded-full">
          Reward: {monthlyReward} GP
        </span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">Overall Progress</span>
        <span className="text-gray-600 font-semibold">
          {completedMonthlyTasks} / {totalMonthlyTasks} tasks
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {completedMonthlyTasks === totalMonthlyTasks && (
        <p className="text-center mt-4 text-green-600 font-semibold">
          Congratulations! You completed the monthly challenge! 🏆 (+{monthlyReward} GP)
        </p>
      )}
    </div>
  );
};

export default MonthlyChallenge; 