import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProgressChart from "../components/charts/ProgressChart";
import { getGoals, getWorkouts, getMeals } from "../firebase/firebaseServices";
import { useAuthContext } from "../context/AuthContext";
import { GOAL_CATEGORIES } from "../utils/constants";
import {
	Activity,
	Flame,
	Dumbbell,
	Utensils,
	Target,
	TrendingUp,
	TrendingDown,
	ArrowRight,
	ChevronRight,
	Trophy,
	Calendar,
	Zap,
	User,
} from "lucide-react";

// --- Components ---

const BentoItem = ({ children, className = "", delay = "" }) => (
	<div
		className={`bento-card p-6 relative overflow-hidden group animate-fade-in-up ${delay} ${className}`}
	>
		{children}
	</div>
);

const StatCard = ({
	icon: Icon,
	label,
	value,
	subValue,
	iconColor,
	iconBg,
	trend,
}) => (
	<div className="h-full flex flex-col justify-between">
		<div className="flex justify-between items-start">
			<div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
				<Icon size={24} strokeWidth={2.5} />
			</div>
			{trend !== undefined && (
				<div
					className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
						trend >= 0
							? "bg-emerald-50 text-emerald-700 border-emerald-100"
							: "bg-rose-50 text-rose-700 border-rose-100"
					}`}
				>
					{trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
					<span>{Math.abs(trend)}%</span>
				</div>
			)}
		</div>
		<div className="mt-5">
			<p className="text-3xl font-bold text-slate-800 tracking-tight">
				{value}
			</p>
			<p className="text-sm font-medium text-slate-500">{label}</p>
			{subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
		</div>
	</div>
);

const QuickAction = ({ icon: Icon, label, to, gradient }) => (
	<Link
		to={to}
		className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${gradient} text-white`}
	>
		<div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
		<div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
			<Icon size={20} strokeWidth={2.5} />
		</div>
		<span className="font-semibold text-base tracking-wide">{label}</span>
		<ArrowRight
			className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0"
			size={18}
		/>
	</Link>
);

// Helper to map category IDs to Lucide Icons
const getCategoryIcon = (id) => {
	switch (id) {
		case "weight-loss":
			return Flame;
		case "muscle-gain":
			return Dumbbell;
		case "endurance":
			return Activity;
		case "nutrition":
			return Utensils;
		case "wellness":
			return Zap;
		default:
			return Target;
	}
};

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
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user]);

	const activeGoals = goals.filter((g) => g.status === "active");
	const completedGoals = goals.filter((g) => g.status === "completed");
	const totalCaloriesToday = meals
		.filter(
			(m) =>
				m.createdAt?.toDate?.().toDateString() === new Date().toDateString(),
		)
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
			<div className="min-h-screen flex flex-col bg-slate-50">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="animate-spin text-blue-600">
							<Activity size={48} />
						</div>
						<p className="text-slate-500 font-medium">Syncing data...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
			<Navbar />

			<main className="flex-grow p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
				{/* Header */}
				<header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
					<div>
						<h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
							{greeting()},{" "}
							<span className="text-blue-600">
								{user?.displayName || "Athlete"}
							</span>
						</h1>
						<p className="text-slate-500 mt-2 text-lg">
							Your fitness journey at a glance.
						</p>
					</div>
					<div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
						<Calendar size={16} />
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</div>
				</header>

				{/* BENTO GRID */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-5">
					{/* 1. Quick Actions */}
					<div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up animation-delay-100">
						<QuickAction
							icon={Target}
							label="New Goal"
							to="/goals"
							gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
						/>
						<QuickAction
							icon={Dumbbell}
							label="Log Workout"
							to="/workouts"
							gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
						/>
						<QuickAction
							icon={Utensils}
							label="Log Meal"
							to="/diet"
							gradient="bg-gradient-to-br from-orange-400 to-rose-500"
						/>
						<QuickAction
							icon={User}
							label="Profile"
							to="/profile"
							gradient="bg-gradient-to-br from-violet-500 to-purple-600"
						/>
					</div>

					{/* 2. Main Chart */}
					<BentoItem
						className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col"
						delay="animation-delay-200"
					>
						<div className="flex justify-between items-center mb-6">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<Activity size={20} />
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									Calorie Trend
								</h3>
							</div>
							<Link
								to="/diet"
								className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
							>
								View Details <ChevronRight size={16} />
							</Link>
						</div>
						<div className="flex-grow w-full min-h-[220px]">
							{chartData.some((d) => d.calories > 0) ? (
								<ProgressChart data={chartData} />
							) : (
								<div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
									<Activity size={32} className="mb-2 opacity-50" />
									<p className="text-sm font-medium">
										No data recorded this week
									</p>
								</div>
							)}
						</div>
					</BentoItem>

					{/* 3. Stats Cards */}
					<BentoItem delay="animation-delay-300">
						<StatCard
							icon={Flame}
							label="Calories Today"
							value={totalCaloriesToday}
							subValue="kcal consumed"
							iconColor="text-orange-600"
							iconBg="bg-orange-50"
						/>
					</BentoItem>

					<BentoItem delay="animation-delay-300">
						<StatCard
							icon={Dumbbell}
							label="Weekly Workouts"
							value={workoutsThisWeek}
							subValue="Sessions completed"
							iconColor="text-emerald-600"
							iconBg="bg-emerald-50"
							trend={workoutsThisWeek > 0 ? 12 : 0}
						/>
					</BentoItem>

					{/* 4. Active Goals List */}
					<BentoItem
						className="col-span-1 md:col-span-1 lg:row-span-2 flex flex-col"
						delay="animation-delay-200"
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-bold text-slate-800">Active Goals</h3>
							<span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
								{activeGoals.length}
							</span>
						</div>

						<div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar flex-grow">
							{activeGoals.length > 0 ? (
								activeGoals.map((goal) => {
									const Icon = getCategoryIcon(goal.category);
									const progress = Math.min(
										100,
										Math.round(
											((goal.currentValue - (goal.startValue || 0)) /
												(goal.targetValue - (goal.startValue || 0))) *
												100,
										),
									);

									return (
										<div
											key={goal.id}
											className="group/item bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200"
										>
											<div className="flex justify-between items-start mb-3">
												<div className="flex items-center gap-3">
													<div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
														<Icon size={18} />
													</div>
													<div>
														<p className="font-semibold text-slate-800 text-sm leading-tight">
															{goal.title}
														</p>
														<p className="text-xs text-slate-500 mt-1">
															{progress}% Completed
														</p>
													</div>
												</div>
											</div>
											<div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
													style={{ width: `${progress}%` }}
												/>
											</div>
										</div>
									);
								})
							) : (
								<div className="flex flex-col items-center justify-center h-full text-center py-8">
									<div className="bg-slate-100 p-3 rounded-full mb-3 text-slate-400">
										<Target size={24} />
									</div>
									<p className="text-slate-500 text-sm mb-3">
										No active goals found.
									</p>
									<Link
										to="/goals"
										className="text-blue-600 text-xs font-bold hover:underline"
									>
										Create Goal
									</Link>
								</div>
							)}
						</div>
					</BentoItem>

					{/* 5. Completed Goals */}
					<BentoItem delay="animation-delay-400">
						<StatCard
							icon={Trophy}
							label="Achievements"
							value={completedGoals.length}
							subValue="Goals completed"
							iconColor="text-yellow-600"
							iconBg="bg-yellow-50"
						/>
					</BentoItem>

					{/* 6. Recent Activity List */}
					<BentoItem
						className="col-span-1 md:col-span-2 lg:col-span-2"
						delay="animation-delay-400"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-bold text-slate-800">
								Recent Activity
							</h3>
						</div>
						{workouts.length > 0 ? (
							<div className="space-y-3">
								{workouts.slice(0, 2).map((w, i) => (
									<div
										key={i}
										className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
									>
										<div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
											<Dumbbell size={20} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-slate-800 truncate">
												{w.name || "Workout Session"}
											</p>
											<p className="text-xs text-slate-500">
												{new Date(w.createdAt?.toDate?.()).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-slate-800 text-sm">
												{w.duration} min
											</p>
											<p className="text-xs text-orange-500 font-medium">
												{w.calories} kcal
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-slate-400 text-sm italic">
								No recent activity logged.
							</p>
						)}
					</BentoItem>

					{/* 7. Motivation Tile */}
					<div className="col-span-1 md:col-span-2 lg:col-span-1 relative overflow-hidden rounded-3xl p-6 text-white bg-slate-900 shadow-xl animate-fade-in-up animation-delay-400 flex flex-col justify-center group">
						<div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
							<Zap size={120} />
						</div>
						<div className="relative z-10">
							<p className="text-lg font-medium leading-relaxed italic opacity-90">
								"The only bad workout is the one that didn't happen."
							</p>
							<div className="mt-4 flex items-center gap-2">
								<div className="h-1 w-8 bg-blue-500 rounded-full"></div>
								<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
									Daily Motivation
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Dashboard;
