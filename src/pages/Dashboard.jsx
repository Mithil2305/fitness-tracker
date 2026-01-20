import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProgressChart from "../components/charts/ProgressChart";
import { getGoals, getWorkouts, getMeals } from "../firebase/firebaseServices";
import { useAuthContext } from "../context/AuthContext";
import { GOAL_CATEGORIES } from "../utils/constants";

const StatCard = ({ icon, label, value, subValue, color, trend }) => (
	<div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm text-gray-500 mb-1">{label}</p>
				<p className={`text-2xl font-bold ${color || "text-gray-800"}`}>
					{value}
				</p>
				{subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
			</div>
			<div className="text-3xl">{icon}</div>
		</div>
		{trend !== undefined && (
			<div
				className={`mt-2 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
			>
				{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
			</div>
		)}
	</div>
);

const GoalPreviewCard = ({ goal }) => {
	const category =
		GOAL_CATEGORIES.find((c) => c.id === goal.category) || GOAL_CATEGORIES[8];
	const progress = Math.min(
		100,
		Math.round(
			((goal.currentValue - (goal.startValue || 0)) /
				(goal.targetValue - (goal.startValue || 0))) *
				100,
		),
	);

	return (
		<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
			<span className="text-2xl">{category.icon}</span>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-gray-800 truncate">{goal.title}</p>
				<div className="flex items-center gap-2 mt-1">
					<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${progress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
							style={{ width: `${progress}%` }}
						/>
					</div>
					<span className="text-xs font-medium text-gray-500">{progress}%</span>
				</div>
			</div>
		</div>
	);
};

const QuickActionButton = ({ icon, label, to, color }) => (
	<Link
		to={to}
		className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} hover:opacity-90 transition-opacity text-white shadow-md`}
	>
		<span className="text-2xl">{icon}</span>
		<span className="text-sm font-medium">{label}</span>
	</Link>
);

const Dashboard = () => {
	const { user } = useAuthContext();
	const [goals, setGoals] = useState([]);
	const [workouts, setWorkouts] = useState([]);
	const [meals, setMeals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!user) return;
			try {
				setLoading(true);
				const [goalsData, workoutsData, mealsData] = await Promise.all([
					getGoals(user.uid),
					getWorkouts(user.uid),
					getMeals(user.uid),
				]);
				setGoals(goalsData);
				setWorkouts(workoutsData);
				setMeals(mealsData);

				// Generate chart data from meals (last 7 days)
				const last7Days = Array.from({ length: 7 }, (_, i) => {
					const date = new Date();
					date.setDate(date.getDate() - (6 - i));
					return date;
				});

				const caloriesByDay = last7Days.map((date) => {
					const dayMeals = mealsData.filter((meal) => {
						const mealDate = meal.createdAt?.toDate?.();
						if (!mealDate) return false;
						return mealDate.toDateString() === date.toDateString();
					});
					const totalCalories = dayMeals.reduce(
						(sum, meal) => sum + (meal.calories || 0),
						0,
					);
					return {
						name: date.toLocaleDateString("en-US", { weekday: "short" }),
						calories: totalCalories,
					};
				});

				setChartData(caloriesByDay);
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	const activeGoals = goals.filter((g) => g.status === "active");
	const completedGoals = goals.filter((g) => g.status === "completed");
	const totalCaloriesToday = meals
		.filter((m) => {
			const mealDate = m.createdAt?.toDate?.();
			return mealDate?.toDateString() === new Date().toDateString();
		})
		.reduce((sum, m) => sum + (m.calories || 0), 0);

	const workoutsThisWeek = workouts.filter((w) => {
		const workoutDate = w.createdAt?.toDate?.();
		if (!workoutDate) return false;
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return workoutDate >= weekAgo;
	}).length;

	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
			<Navbar />

			<main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
				{/* Welcome Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						{greeting()}, {user?.displayName || "Athlete"}! 👋
					</h1>
					<p className="text-gray-500 mt-1">
						Here's your fitness overview for today
					</p>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<QuickActionButton
						icon="🎯"
						label="New Goal"
						to="/goals"
						color="bg-gradient-to-br from-blue-500 to-blue-600"
					/>
					<QuickActionButton
						icon="🏋️"
						label="Log Workout"
						to="/workouts"
						color="bg-gradient-to-br from-green-500 to-green-600"
					/>
					<QuickActionButton
						icon="🥗"
						label="Log Meal"
						to="/diet"
						color="bg-gradient-to-br from-orange-500 to-orange-600"
					/>
					<QuickActionButton
						icon="👤"
						label="Profile"
						to="/profile"
						color="bg-gradient-to-br from-purple-500 to-purple-600"
					/>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<StatCard
						icon="🎯"
						label="Active Goals"
						value={activeGoals.length}
						subValue={`${completedGoals.length} completed`}
						color="text-blue-600"
					/>
					<StatCard
						icon="🔥"
						label="Calories Today"
						value={totalCaloriesToday}
						subValue="kcal consumed"
						color="text-orange-600"
					/>
					<StatCard
						icon="🏋️"
						label="Workouts This Week"
						value={workoutsThisWeek}
						subValue="sessions logged"
						color="text-green-600"
					/>
					<StatCard
						icon="📊"
						label="Total Meals"
						value={meals.length}
						subValue="meals tracked"
						color="text-purple-600"
					/>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Chart Section */}
					<div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-bold text-gray-800">
								Calorie Intake (Last 7 Days)
							</h2>
							<Link
								to="/diet"
								className="text-blue-600 text-sm hover:underline"
							>
								View all →
							</Link>
						</div>
						{chartData.some((d) => d.calories > 0) ? (
							<ProgressChart data={chartData} />
						) : (
							<div className="h-64 flex items-center justify-center text-gray-400">
								<div className="text-center">
									<span className="text-4xl block mb-2">📊</span>
									<p>No meal data yet. Start logging your meals!</p>
								</div>
							</div>
						)}
					</div>

					{/* Goals Preview */}
					<div className="bg-white rounded-xl p-6 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-bold text-gray-800">Active Goals</h2>
							<Link
								to="/goals"
								className="text-blue-600 text-sm hover:underline"
							>
								View all →
							</Link>
						</div>

						{activeGoals.length > 0 ? (
							<div className="space-y-3">
								{activeGoals.slice(0, 4).map((goal) => (
									<GoalPreviewCard key={goal.id} goal={goal} />
								))}
								{activeGoals.length > 4 && (
									<p className="text-center text-sm text-gray-500">
										+{activeGoals.length - 4} more goals
									</p>
								)}
							</div>
						) : (
							<div className="text-center py-8 text-gray-400">
								<span className="text-4xl block mb-2">🎯</span>
								<p className="mb-3">No active goals yet</p>
								<Link
									to="/goals"
									className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
								>
									Create Your First Goal
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Recent Activity */}
				<div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
					<h2 className="text-lg font-bold text-gray-800 mb-4">
						Recent Activity
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Recent Workouts */}
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-3">
								Latest Workouts
							</h3>
							{workouts.length > 0 ? (
								<div className="space-y-2">
									{workouts.slice(0, 3).map((workout) => (
										<div
											key={workout.id}
											className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
										>
											<span className="text-xl">🏋️</span>
											<div className="flex-1">
												<p className="font-medium text-gray-800">
													{workout.name || workout.type}
												</p>
												<p className="text-xs text-gray-500">
													{workout.duration} min • {workout.calories || 0} kcal
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-400 text-sm">No workouts logged yet</p>
							)}
						</div>

						{/* Recent Meals */}
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-3">
								Latest Meals
							</h3>
							{meals.length > 0 ? (
								<div className="space-y-2">
									{meals.slice(0, 3).map((meal) => (
										<div
											key={meal.id}
											className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
										>
											<span className="text-xl">🥗</span>
											<div className="flex-1">
												<p className="font-medium text-gray-800">{meal.name}</p>
												<p className="text-xs text-gray-500">
													{meal.type} • {meal.calories} kcal
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-400 text-sm">No meals logged yet</p>
							)}
						</div>
					</div>
				</div>

				{/* Motivation Quote */}
				<div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
					<p className="text-lg font-medium italic">
						"The only bad workout is the one that didn't happen."
					</p>
					<p className="text-sm opacity-75 mt-2">— Keep pushing forward! 💪</p>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Dashboard;
