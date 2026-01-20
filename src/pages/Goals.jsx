import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GoalForm from "../components/goals/GoalForm";
import GoalList from "../components/goals/GoalList";
import {
	addGoal,
	getGoals,
	updateGoal,
	updateGoalProgress,
	deleteGoal,
} from "../firebase/firebaseServices";
import { useAuthContext } from "../context/AuthContext";
import { Target, Plus, Trophy, Zap, CheckCircle2 } from "lucide-react";

const Goals = () => {
	const { user } = useAuthContext();
	const [goals, setGoals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingGoal, setEditingGoal] = useState(null);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const fetchGoals = useCallback(async () => {
		if (!user) return;
		try {
			setLoading(true);
			const data = await getGoals(user.uid);
			setGoals(data);
		} catch (err) {
			console.error("Error fetching goals:", err);
			setError("Failed to load goals.");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchGoals();
	}, [fetchGoals]);

	const showSuccess = (message) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	const handleAddGoal = async (goalData) => {
		try {
			await addGoal(user.uid, goalData);
			await fetchGoals();
			setShowForm(false);
			showSuccess("Goal created successfully!");
		} catch (err) {
			setError("Failed to create goal.", err);
		}
	};

	const handleUpdateGoal = async (goalData) => {
		try {
			await updateGoal(editingGoal.id, goalData);
			await fetchGoals();
			setEditingGoal(null);
			setShowForm(false);
			showSuccess("Goal updated successfully!");
		} catch (err) {
			setError("Failed to update goal.", err);
		}
	};

	const handleUpdateProgress = async (goalId, newValue) => {
		try {
			await updateGoalProgress(goalId, newValue);
			await fetchGoals();
			showSuccess("Progress updated!");
		} catch (err) {
			setError("Failed to update progress.", err);
		}
	};

	const handleStatusChange = async (goalId, newStatus) => {
		try {
			await updateGoal(goalId, { status: newStatus });
			await fetchGoals();
			showSuccess(`Goal marked as ${newStatus}`);
		} catch (err) {
			setError("Failed to update status.", err);
		}
	};

	const handleDeleteGoal = async (goalId) => {
		if (!window.confirm("Delete this goal?")) return;
		try {
			await deleteGoal(goalId);
			await fetchGoals();
			showSuccess("Goal deleted.");
		} catch (err) {
			setError("Failed to delete goal.", err);
		}
	};

	const handleEdit = (goal) => {
		setEditingGoal(goal);
		setShowForm(true);
	};

	// Stats Calculation
	const stats = {
		total: goals.length,
		active: goals.filter((g) => g.status === "active").length,
		completed: goals.filter((g) => g.status === "completed").length,
		highPriority: goals.filter(
			(g) => g.status === "active" && g.priority === "high",
		).length,
	};

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<Navbar />

			<main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-fade-in-up">
					<div>
						<h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
							<span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
								<Target size={28} />
							</span>
							Goals & Milestones
						</h1>
						<p className="text-slate-500 mt-2 text-lg">
							Set targets and crush them one by one.
						</p>
					</div>

					{!showForm && (
						<button
							onClick={() => setShowForm(true)}
							className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
						>
							<Plus
								size={20}
								className="group-hover:rotate-90 transition-transform duration-300"
							/>
							Create New Goal
						</button>
					)}
				</div>

				{/* Stats Grid (Bento) */}
				{!showForm && (
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-100">
						<div className="bento-card p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
							<div className="p-3 bg-blue-50 text-blue-600 rounded-full">
								<Target size={24} />
							</div>
							<div>
								<p className="text-slate-500 text-xs font-bold uppercase">
									Total Goals
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{stats.total}
								</p>
							</div>
						</div>

						<div className="bento-card p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
							<div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
								<Zap size={24} />
							</div>
							<div>
								<p className="text-slate-500 text-xs font-bold uppercase">
									Active
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{stats.active}
								</p>
							</div>
						</div>

						<div className="bento-card p-5 flex items-center gap-4 border-l-4 border-l-yellow-500">
							<div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
								<Trophy size={24} />
							</div>
							<div>
								<p className="text-slate-500 text-xs font-bold uppercase">
									Completed
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{stats.completed}
								</p>
							</div>
						</div>

						<div className="bento-card p-5 flex items-center gap-4 border-l-4 border-l-rose-500">
							<div className="p-3 bg-rose-50 text-rose-600 rounded-full">
								<CheckCircle2 size={24} />
							</div>
							<div>
								<p className="text-slate-500 text-xs font-bold uppercase">
									High Priority
								</p>
								<p className="text-2xl font-bold text-slate-800">
									{stats.highPriority}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Notifications */}
				{successMessage && (
					<div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in-up">
						<CheckCircle2 size={20} />
						<span className="font-medium">{successMessage}</span>
					</div>
				)}

				{error && (
					<div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl flex items-center gap-3 animate-fade-in-up">
						<span className="font-bold">!</span>
						<span className="font-medium">{error}</span>
					</div>
				)}

				{/* Form or List */}
				<div className="animate-fade-in-up animation-delay-200">
					{showForm ? (
						<GoalForm
							onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
							initialData={editingGoal}
							onCancel={() => {
								setShowForm(false);
								setEditingGoal(null);
							}}
						/>
					) : (
						<GoalList
							goals={goals}
							loading={loading}
							onUpdateProgress={handleUpdateProgress}
							onEdit={handleEdit}
							onDelete={handleDeleteGoal}
							onStatusChange={handleStatusChange}
						/>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Goals;
