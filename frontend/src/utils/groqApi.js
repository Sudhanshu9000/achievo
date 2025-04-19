export const generateTasks = async (goal) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "system",
          content: `You are a task generator that creates daily learning tasks. 
          Generate 3 tasks for the following goal:
          Title: ${goal.title}
          Description: ${goal.description || 'No description provided'}
          
          The tasks should:
          1. Start with basic concepts
          2. Gradually increase in difficulty
          3. Be specific and actionable
          4. Be relevant to the goal
          
          Return the tasks in this exact JSON format:
          {
            "tasks": [
              { "id": 1, "text": "task1", "completed": false, "points": 50 },
              { "id": 2, "text": "task2", "completed": false, "points": 50 },
              { "id": 3, "text": "task3", "completed": false, "points": 50 }
            ]
          }`
        }]
      })
    });

    const data = await response.json();
    const tasks = JSON.parse(data.choices[0].message.content).tasks;
    return tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
   
    return [
      { id: 1, text: 'Complete daily meditation', completed: false, points: 50 },
      { id: 2, text: 'Read for 30 minutes', completed: false, points: 50 },
      { id: 3, text: 'Exercise for 20 minutes', completed: false, points: 50 }
    ];
  }
}; 