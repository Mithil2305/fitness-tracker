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

const Workouts = () => {
	const { user } = useAuth();
	const [workouts, setWorkouts] = useState([]);

	useEffect(() => {
		if (user) {
			getWorkouts(user.uid).then(setWorkouts);
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

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="p-6">
				<WorkoutForm onAddWorkout={handleAddWorkout} />
				<WorkoutList
					workouts={workouts}
					onDeleteWorkout={handleDeleteWorkout}
				/>
			</div>
		</div>
	);
};

export default Workouts;
