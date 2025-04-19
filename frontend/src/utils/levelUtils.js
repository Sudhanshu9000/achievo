
export function calculateLevel(points) {
  let level = 0; 
  let pointsNeededForNextLevel = 50; 
  let totalPointsThreshold = 0;

  while (true) {
    
    const thresholdForNextLevel = totalPointsThreshold + pointsNeededForNextLevel;
    
    if (points < thresholdForNextLevel) {
      return level;
    }
    level++;
    totalPointsThreshold = thresholdForNextLevel; 
    pointsNeededForNextLevel *= 2; 
  }
} 