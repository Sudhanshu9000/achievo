'use client';
import { useUser } from '../../context/UserContext'; 

export default function ProfilePage() {
  const { userPoints, currentUserLevel, rewardHistory } = useUser(); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-12 px-4 sm:px-6 lg:px-8"> 
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">User Profile</h1>
          
          <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-6">
              <span className="text-gray-500 text-3xl">👤</span>
            </div>

            {/* Level Display */}
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-lg font-medium text-gray-700">Current Level:</span>
              {/* Use level from context */}
              <span className="text-xl font-bold text-blue-600">{currentUserLevel}</span>
            </div>

            {/* GP Display */}
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-lg font-medium text-gray-700">Total Game Points (GP):</span>
              {/* Use points from context */}
              <span className="text-xl font-bold text-green-600">{userPoints}</span>
            </div>

            {/* Reward History */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Reward History</h2>
              {rewardHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rewards earned yet</p>
              ) : (
                <div className="space-y-3">
                  {rewardHistory.map((reward) => (
                    <div 
                      key={reward.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{reward.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(reward.date)}</p>
                      </div>
                      <span className="text-green-600 font-semibold">+{reward.points} GP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 