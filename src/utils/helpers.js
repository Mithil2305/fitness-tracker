/* Sum calories from meals */
export const calculateTotalCalories = (meals = []) =>
  meals.reduce((total, meal) => total + (meal.calories || 0), 0);

/* Sum calories burned from workouts */
export const calculateCaloriesBurned = (workouts = []) =>
  workouts.reduce(
    (total, workout) => total + (workout.caloriesBurned || 0),
    0
  );

/* Format Firestore timestamp */
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
};
