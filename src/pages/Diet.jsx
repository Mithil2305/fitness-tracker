import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import MealForm from "../components/diet/MealForm";
import MealList from "../components/diet/MealList";
import useAuth from "../hooks/useAuth";
import { addMeal, getMeals, deleteMeal } from "../firebase/firebaseServices";
import { Utensils, TrendingUp } from "lucide-react";

const Diet = () => {
	const { user } = useAuth();
	const [meals, setMeals] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
			getMeals(user.uid).then((data) => {
				setMeals(data);
				setLoading(false);
			});
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

	const totalCalories = meals.reduce(
		(sum, m) => sum + (Number(m.calories) || 0),
		0,
	);

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<Navbar />

			<main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
				{/* Header */}
				<div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in-up">
					<div>
						<h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
							<span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
								<Utensils size={28} />
							</span>
							Diet Log
						</h1>
						<p className="text-slate-500 mt-2">
							Track your nutrition and calorie intake.
						</p>
					</div>

					<div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
						<div className="p-2 bg-orange-50 text-orange-600 rounded-full">
							<TrendingUp size={20} />
						</div>
						<div>
							<p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
								Total Calories
							</p>
							<p className="text-xl font-bold text-slate-800">
								{totalCalories}{" "}
								<span className="text-sm font-normal text-slate-400">kcal</span>
							</p>
						</div>
					</div>
				</div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Form */}
					<div className="lg:col-span-1 animate-fade-in-up animation-delay-100">
						<MealForm onAddMeal={handleAddMeal} />
					</div>

					{/* Right Column: List */}
					<div className="lg:col-span-2 animate-fade-in-up animation-delay-200">
						<MealList
							meals={meals}
							onDeleteMeal={handleDeleteMeal}
							loading={loading}
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Diet;
