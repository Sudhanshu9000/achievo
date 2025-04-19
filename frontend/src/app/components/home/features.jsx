import "remixicon/fonts/remixicon.css";

export default function Features() {
  const features = [
    {
      icon: "ri-flag-2-line",
      title: "Goal Setting",
      description: "Set clear, long-term goals across health, learning, career, and more. Break them down into manageable challenges to keep you focused and aligned."
    },
    {
      icon: "ri-robot-line",
      title: "AI-Generated Daily Tasks",
      description: "Get smart, daily task suggestions powered by AI -  tailored to your goals, skill level, and time availability."
    },
    {
      icon: "ri-trophy-line",
      title: "Rewards & Gamification",
      description: "Earn points, unlock achievements, and level up your avatar as you complete tasks. Productivity has never been this fun."
    }
  ];

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-black">
        Level Up Every Day with Powerful Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col items-start">
                <i className={`${feature.icon} text-3xl text-gray-800 mb-4`}></i>
                <h3 className="text-xl font-semibold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 