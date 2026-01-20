import { useState } from "react";

const MealForm = ({ onAddMeal }) => {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [type, setType] = useState("Breakfast");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mealName || !calories) return;

    onAddMeal({
      id: Date.now(),
      mealName,
      calories: Number(calories),
      type,
      createdAt: new Date(),
    });

    setMealName("");
    setCalories("");
    setType("Breakfast");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Add Meal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Meal name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Meal
      </button>
    </form>
  );
};

export default MealForm;
