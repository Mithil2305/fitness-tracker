import { useState } from "react";
import { Plus, Type, Flame, Coffee } from "lucide-react";

const MealForm = ({ onAddMeal }) => {
	const [mealName, setMealName] = useState("");
	const [calories, setCalories] = useState("");
	const [type, setType] = useState("Breakfast");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!mealName || !calories) return;

		setIsSubmitting(true);
		await onAddMeal({
			id: Date.now(),
			mealName,
			calories: Number(calories),
			type,
			createdAt: new Date(),
		});

		setMealName("");
		setCalories("");
		setIsSubmitting(false);
	};

	return (
		<div className="bento-card p-6 sticky top-24">
			<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
				<span className="w-1 h-6 bg-orange-500 rounded-full"></span>
				Add New Meal
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
						<Type size={14} /> Meal Name
					</label>
					<input
						type="text"
						placeholder="e.g., Grilled Chicken Salad"
						value={mealName}
						onChange={(e) => setMealName(e.target.value)}
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
							<Flame size={14} /> Calories
						</label>
						<input
							type="number"
							placeholder="0"
							value={calories}
							onChange={(e) => setCalories(e.target.value)}
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
							<Coffee size={14} /> Type
						</label>
						<div className="relative">
							<select
								value={type}
								onChange={(e) => setType(e.target.value)}
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none transition-all cursor-pointer"
							>
								<option>Breakfast</option>
								<option>Lunch</option>
								<option>Dinner</option>
								<option>Snack</option>
							</select>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
								▼
							</div>
						</div>
					</div>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
				>
					{isSubmitting ? (
						"Adding..."
					) : (
						<>
							<Plus size={20} /> Add Meal
						</>
					)}
				</button>
			</form>
		</div>
	);
};

export default MealForm;
