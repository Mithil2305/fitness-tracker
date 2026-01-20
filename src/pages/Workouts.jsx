import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import WorkoutForm from "../components/workout/WorkoutForm";
import WorkoutList from "../components/workout/WorkoutList";
import useAuth from "../hooks/useAuth";
import {
	addWorkout,
	getWorkouts,
	deleteWorkout,
} from "../firebase/firebaseServices";
import { Dumbbell, Activity } from "lucide-react";

const Workouts = () => {
	const { user } = useAuth();
	const [workouts, setWorkouts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
			getWorkouts(user.uid).then((data) => {
				setWorkouts(data);
				setLoading(false);
			});
		}
	}, [user]);

	const handleAddWorkout = async (workout) => {
		await addWorkout(user.uid, workout);
		setWorkouts(await getWorkouts(user.uid));
	};

	const handleDeleteWorkout = async (id) => {
		await deleteWorkout(id);
		setWorkouts(workouts.filter((w) => w.id !== id));
	};

	const totalDuration = workouts.reduce(
		(sum, w) => sum + (Number(w.duration) || 0),
		0,
	);

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<Navbar />

			<main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
				<div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in-up">
					<div>
						<h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
							<span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
								<Dumbbell size={28} />
							</span>
							Workout Log
						</h1>
						<p className="text-slate-500 mt-2">
							Log your exercises and track your performance.
						</p>
					</div>

					<div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
						<div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
							<Activity size={20} />
						</div>
						<div>
							<p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
								Active Time
							</p>
							<p className="text-xl font-bold text-slate-800">
								{totalDuration}{" "}
								<span className="text-sm font-normal text-slate-400">mins</span>
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1 animate-fade-in-up animation-delay-100">
						<WorkoutForm onAddWorkout={handleAddWorkout} />
					</div>

					<div className="lg:col-span-2 animate-fade-in-up animation-delay-200">
						<WorkoutList
							workouts={workouts}
							onDeleteWorkout={handleDeleteWorkout}
							loading={loading}
						/>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Workouts;
