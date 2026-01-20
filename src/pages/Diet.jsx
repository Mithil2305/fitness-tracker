import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import MealForm from "../components/diet/MealForm";
import MealList from "../components/diet/MealList";
import useAuth from "../hooks/useAuth";
import { addMeal, getMeals, deleteMeal } from "../firebase/firebaseServices";

const Diet = () => {
	const { user } = useAuth();
	const [meals, setMeals] = useState([]);

	useEffect(() => {
		if (user) {
			getMeals(user.uid).then(setMeals);
		}
	}, [user]);

	const handleAddMeal = async (meal) => {
		await addMeal(user.uid, meal);
		setMeals(await getMeals(user.uid));
	};

	const handleDeleteMeal = async (id) => {
		await deleteMeal(id);
		setMeals(meals.filter((m) => m.id !== id));
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="p-6">
				<MealForm onAddMeal={handleAddMeal} />
				<MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
			</div>
		</div>
	);
};

export default Diet;
