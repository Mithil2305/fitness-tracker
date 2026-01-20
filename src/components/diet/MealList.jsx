import { Trash2, Coffee, Sun, Moon, Utensils } from "lucide-react";

const MealList = ({ meals, onDeleteMeal, loading }) => {
	const getTypeIcon = (type) => {
		switch (type?.toLowerCase()) {
			case "breakfast":
				return <Coffee size={18} className="text-orange-500" />;
			case "lunch":
				return <Sun size={18} className="text-yellow-500" />;
			case "dinner":
				return <Moon size={18} className="text-indigo-500" />;
			default:
				return <Utensils size={18} className="text-green-500" />;
		}
	};

	if (loading) {
		return (
			<div className="text-center py-10 text-slate-400 animate-pulse">
				Loading meals...
			</div>
		);
	}

	if (meals.length === 0) {
		return (
			<div className="bento-card p-10 flex flex-col items-center justify-center text-center text-slate-400 border-dashed border-2 border-slate-200">
				<div className="bg-slate-50 p-4 rounded-full mb-4">
					<Utensils size={32} className="opacity-50" />
				</div>
				<p className="text-lg font-medium text-slate-600">
					No meals logged yet
				</p>
				<p className="text-sm">
					Start tracking your nutrition by adding a meal.
				</p>
			</div>
		);
	}

	return (
		<div className="bento-card p-0 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold tracking-wider">
						<tr>
							<th className="p-5 pl-6">Meal Details</th>
							<th className="p-5">Type</th>
							<th className="p-5">Calories</th>
							<th className="p-5 text-right pr-6">Action</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{meals.map((meal) => (
							<tr
								key={meal.id}
								className="group hover:bg-slate-50/80 transition-colors"
							>
								<td className="p-5 pl-6">
									<p className="font-semibold text-slate-800">
										{meal.mealName}
									</p>
									<p className="text-xs text-slate-400 md:hidden">
										{meal.type} • {meal.calories} kcal
									</p>
								</td>
								<td className="p-5">
									<div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full w-fit shadow-sm text-sm font-medium text-slate-600">
										{getTypeIcon(meal.type)}
										{meal.type}
									</div>
								</td>
								<td className="p-5">
									<span className="font-bold text-slate-700">
										{meal.calories}
									</span>
									<span className="text-slate-400 text-xs ml-1">kcal</span>
								</td>
								<td className="p-5 text-right pr-6">
									<button
										onClick={() => onDeleteMeal(meal.id)}
										className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
										title="Delete Meal"
									>
										<Trash2 size={18} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MealList;
