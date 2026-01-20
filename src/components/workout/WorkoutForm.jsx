import { useState } from "react";

const WorkoutForm = ({ onAddWorkout }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!workoutName || !duration || !caloriesBurned) return;

    onAddWorkout({
      id: Date.now(),
      workoutName,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      createdAt: new Date(),
    });

    setWorkoutName("");
    setDuration("");
    setCaloriesBurned("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Add Workout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Workout name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Calories burned"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Workout
      </button>
    </form>
  );
};

export default WorkoutForm;
