import { useState } from "react";
import { Plus, Dumbbell, Clock, Flame } from "lucide-react";

const WorkoutForm = ({ onAddWorkout }) => {
	const [workoutName, setWorkoutName] = useState("");
	const [duration, setDuration] = useState("");
	const [caloriesBurned, setCaloriesBurned] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!workoutName || !duration || !caloriesBurned) return;

		setIsSubmitting(true);
		await onAddWorkout({
			id: Date.now(),
			workoutName,
			duration: Number(duration),
			caloriesBurned: Number(caloriesBurned),
			createdAt: new Date(),
		});

		setWorkoutName("");
		setDuration("");
		setCaloriesBurned("");
		setIsSubmitting(false);
	};

	return (
		<div className="bento-card p-6 sticky top-24">
			<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
				<span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
				Log Workout
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
						<Dumbbell size={14} /> Exercise Name
					</label>
					<input
						type="text"
						placeholder="e.g., Running, Bench Press"
						value={workoutName}
						onChange={(e) => setWorkoutName(e.target.value)}
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
							<Clock size={14} /> Duration (min)
						</label>
						<input
							type="number"
							placeholder="30"
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-600 flex items-center gap-2">
							<Flame size={14} /> Calories
						</label>
						<input
							type="number"
							placeholder="100"
							value={caloriesBurned}
							onChange={(e) => setCaloriesBurned(e.target.value)}
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
				>
					{isSubmitting ? (
						"Logging..."
					) : (
						<>
							<Plus size={20} /> Log Session
						</>
					)}
				</button>
			</form>
		</div>
	);
};

export default WorkoutForm;
