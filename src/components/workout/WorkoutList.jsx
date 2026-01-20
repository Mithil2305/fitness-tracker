import { Trash2, Timer, Flame, Dumbbell } from "lucide-react";

const WorkoutList = ({ workouts, onDeleteWorkout, loading }) => {
	if (loading) {
		return (
			<div className="text-center py-10 text-slate-400 animate-pulse">
				Loading workouts...
			</div>
		);
	}

	if (workouts.length === 0) {
		return (
			<div className="bento-card p-10 flex flex-col items-center justify-center text-center text-slate-400 border-dashed border-2 border-slate-200">
				<div className="bg-slate-50 p-4 rounded-full mb-4">
					<Dumbbell size={32} className="opacity-50" />
				</div>
				<p className="text-lg font-medium text-slate-600">
					No workouts logged yet
				</p>
				<p className="text-sm">Get moving and record your first session!</p>
			</div>
		);
	}

	return (
		<div className="bento-card p-0 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold tracking-wider">
						<tr>
							<th className="p-5 pl-6">Workout</th>
							<th className="p-5">Duration</th>
							<th className="p-5">Burned</th>
							<th className="p-5 text-right pr-6">Action</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{workouts.map((workout) => (
							<tr
								key={workout.id}
								className="group hover:bg-slate-50/80 transition-colors"
							>
								<td className="p-5 pl-6">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
											<Dumbbell size={18} />
										</div>
										<span className="font-semibold text-slate-800">
											{workout.workoutName}
										</span>
									</div>
									<div className="md:hidden mt-1 text-xs text-slate-400 ml-10">
										{workout.duration} min • {workout.caloriesBurned} kcal
									</div>
								</td>
								<td className="p-5">
									<div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
										<Timer size={16} className="text-blue-400" />
										{workout.duration} min
									</div>
								</td>
								<td className="p-5">
									<div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
										<Flame size={16} className="text-orange-500" />
										{workout.caloriesBurned} kcal
									</div>
								</td>
								<td className="p-5 text-right pr-6">
									<button
										onClick={() => onDeleteWorkout(workout.id)}
										className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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

export default WorkoutList;
