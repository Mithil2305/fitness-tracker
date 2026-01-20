const WorkoutList = ({ workouts, onDeleteWorkout }) => {
  if (workouts.length === 0) {
    return (
      <p className="text-gray-500 text-center">No workouts added yet.</p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Workout</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Calories Burned</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {workouts.map((workout) => (
            <tr key={workout.id} className="border-t">
              <td className="p-3">{workout.workoutName}</td>
              <td className="p-3">{workout.duration} min</td>
              <td className="p-3">{workout.caloriesBurned}</td>
              <td className="p-3">
                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkoutList;
