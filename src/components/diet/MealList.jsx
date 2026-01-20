const MealList = ({ meals, onDeleteMeal }) => {
  if (meals.length === 0) {
    return (
      <p className="text-gray-500 text-center">No meals added yet.</p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Meal</th>
            <th className="p-3">Type</th>
            <th className="p-3">Calories</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id} className="border-t">
              <td className="p-3">{meal.mealName}</td>
              <td className="p-3">{meal.type}</td>
              <td className="p-3">{meal.calories}</td>
              <td className="p-3">
                <button
                  onClick={() => onDeleteMeal(meal.id)}
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

export default MealList;
