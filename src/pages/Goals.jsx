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
			setError("Failed to load goals. Please try again.");
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
			showSuccess("Goal created successfully! 🎯");
		} catch (err) {
			console.error("Error adding goal:", err);
			setError("Failed to create goal. Please try again.");
		}
	};

	const handleUpdateGoal = async (goalData) => {
		try {
			await updateGoal(editingGoal.id, goalData);
			await fetchGoals();
			setEditingGoal(null);
			setShowForm(false);
			showSuccess("Goal updated successfully! ✨");
		} catch (err) {
			console.error("Error updating goal:", err);
			setError("Failed to update goal. Please try again.");
		}
	};

	const handleUpdateProgress = async (goalId, newValue) => {
		try {
			await updateGoalProgress(goalId, newValue);
			await fetchGoals();
			showSuccess("Progress updated! Keep going! 💪");
		} catch (err) {
			console.error("Error updating progress:", err);
			setError("Failed to update progress. Please try again.");
		}
	};

	const handleStatusChange = async (goalId, newStatus) => {
		try {
			await updateGoal(goalId, { status: newStatus });
			await fetchGoals();
			const messages = {
				completed: "Congratulations! Goal completed! 🎉",
				paused: "Goal paused. Resume whenever you're ready!",
				active: "Goal resumed! Let's do this! 💪",
			};
			showSuccess(messages[newStatus] || "Status updated!");
		} catch (err) {
			console.error("Error changing status:", err);
			setError("Failed to update status. Please try again.");
		}
	};

	const handleDeleteGoal = async (goalId) => {
		if (!window.confirm("Are you sure you want to delete this goal?")) return;
		try {
			await deleteGoal(goalId);
			await fetchGoals();
			showSuccess("Goal deleted.");
		} catch (err) {
			console.error("Error deleting goal:", err);
			setError("Failed to delete goal. Please try again.");
		}
	};

	const handleEdit = (goal) => {
		setEditingGoal(goal);
		setShowForm(true);
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingGoal(null);
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
			<Navbar />

			<main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
							🎯 My Goals
						</h1>
						<p className="text-gray-500 mt-1">
							Track your fitness journey with measurable goals
						</p>
					</div>

					{!showForm && (
						<button
							onClick={() => setShowForm(true)}
							className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
						>
							<span className="text-xl">+</span>
							Create New Goal
						</button>
					)}
				</div>

				{/* Success Message */}
				{successMessage && (
					<div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-xl flex items-center gap-2 animate-pulse">
						<span>✓</span>
						{successMessage}
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl flex items-center justify-between">
						<span>{error}</span>
						<button
							onClick={() => setError("")}
							className="text-red-600 hover:text-red-800"
						>
							✕
						</button>
					</div>
				)}

				{/* Goal Form (Modal-like) */}
				{showForm && (
					<div className="mb-6">
						<GoalForm
							onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
							initialData={editingGoal}
							onCancel={handleCancel}
						/>
					</div>
				)}

				{/* Goals List */}
				{!showForm && (
					<GoalList
						goals={goals}
						loading={loading}
						onUpdateProgress={handleUpdateProgress}
						onEdit={handleEdit}
						onDelete={handleDeleteGoal}
						onStatusChange={handleStatusChange}
					/>
				)}
			</main>

			<Footer />
		</div>
	);
};

export default Goals;
