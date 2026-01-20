import { useState, useMemo } from "react";
import GoalCard from "./GoalCard";
import {
	GOAL_CATEGORIES,
	GOAL_STATUSES,
	GOAL_PRIORITIES,
} from "../../utils/constants";

const GoalList = ({
	goals,
	onUpdateProgress,
	onEdit,
	onDelete,
	onStatusChange,
	loading,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterPriority, setFilterPriority] = useState("all");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const [viewMode, setViewMode] = useState("grid"); // grid or list

	const filteredAndSortedGoals = useMemo(() => {
		let result = [...goals];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(goal) =>
					goal.title.toLowerCase().includes(query) ||
					goal.description?.toLowerCase().includes(query),
			);
		}

		// Category filter
		if (filterCategory !== "all") {
			result = result.filter((goal) => goal.category === filterCategory);
		}

		// Status filter
		if (filterStatus !== "all") {
			result = result.filter((goal) => goal.status === filterStatus);
		}

		// Priority filter
		if (filterPriority !== "all") {
			result = result.filter((goal) => goal.priority === filterPriority);
		}

		// Sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "progress": {
					const progressA = (a.currentValue / a.targetValue) * 100;
					const progressB = (b.currentValue / b.targetValue) * 100;
					comparison = progressA - progressB;
					break;
				}
				case "deadline":
					if (!a.deadline) return 1;
					if (!b.deadline) return -1;
					comparison = new Date(a.deadline) - new Date(b.deadline);
					break;
				case "priority": {
					const priorityOrder = { high: 0, medium: 1, low: 2 };
					comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
					break;
				}
				case "createdAt":
				default: {
					const dateA = a.createdAt?.toDate?.() || new Date(0);
					const dateB = b.createdAt?.toDate?.() || new Date(0);
					comparison = dateA - dateB;
					break;
				}
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return result;
	}, [
		goals,
		searchQuery,
		filterCategory,
		filterStatus,
		filterPriority,
		sortBy,
		sortOrder,
	]);

	const stats = useMemo(() => {
		const activeGoals = goals.filter((g) => g.status === "active");
		const completedGoals = goals.filter((g) => g.status === "completed");
		const avgProgress =
			activeGoals.length > 0
				? Math.round(
						activeGoals.reduce(
							(acc, g) => acc + (g.currentValue / g.targetValue) * 100,
							0,
						) / activeGoals.length,
					)
				: 0;
		const overdueGoals = goals.filter((g) => {
			if (!g.deadline || g.status !== "active") return false;
			return new Date(g.deadline) < new Date();
		});

		return {
			total: goals.length,
			active: activeGoals.length,
			completed: completedGoals.length,
			avgProgress,
			overdue: overdueGoals.length,
		};
	}, [goals]);

	const clearFilters = () => {
		setSearchQuery("");
		setFilterCategory("all");
		setFilterStatus("all");
		setFilterPriority("all");
		setSortBy("createdAt");
		setSortOrder("desc");
	};

	const hasActiveFilters =
		searchQuery ||
		filterCategory !== "all" ||
		filterStatus !== "all" ||
		filterPriority !== "all";

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<div className="bg-white rounded-xl p-4 shadow-sm border">
					<div className="text-2xl font-bold text-gray-800">{stats.total}</div>
					<div className="text-sm text-gray-500">Total Goals</div>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
					<div className="text-2xl font-bold text-blue-600">{stats.active}</div>
					<div className="text-sm text-gray-500">Active</div>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
					<div className="text-2xl font-bold text-green-600">
						{stats.completed}
					</div>
					<div className="text-sm text-gray-500">Completed</div>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border">
					<div className="text-2xl font-bold text-purple-600">
						{stats.avgProgress}%
					</div>
					<div className="text-sm text-gray-500">Avg Progress</div>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-red-200">
					<div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
					<div className="text-sm text-gray-500">Overdue</div>
				</div>
			</div>

			{/* Filters & Search */}
			<div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
				{/* Search & View Toggle */}
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 relative">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search goals..."
							className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							🔍
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => setViewMode("grid")}
							className={`p-2.5 rounded-lg transition-colors ${
								viewMode === "grid"
									? "bg-blue-100 text-blue-600"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							title="Grid view"
						>
							▦
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`p-2.5 rounded-lg transition-colors ${
								viewMode === "list"
									? "bg-blue-100 text-blue-600"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
							title="List view"
						>
							☰
						</button>
					</div>
				</div>

				{/* Filter Dropdowns */}
				<div className="flex flex-wrap gap-3">
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">All Categories</option>
						{GOAL_CATEGORIES.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.icon} {cat.label}
							</option>
						))}
					</select>

					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">All Statuses</option>
						{GOAL_STATUSES.map((status) => (
							<option key={status.id} value={status.id}>
								{status.label}
							</option>
						))}
					</select>

					<select
						value={filterPriority}
						onChange={(e) => setFilterPriority(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">All Priorities</option>
						{GOAL_PRIORITIES.map((p) => (
							<option key={p.id} value={p.id}>
								{p.label}
							</option>
						))}
					</select>

					<select
						value={`${sortBy}-${sortOrder}`}
						onChange={(e) => {
							const [newSortBy, newSortOrder] = e.target.value.split("-");
							setSortBy(newSortBy);
							setSortOrder(newSortOrder);
						}}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
					>
						<option value="createdAt-desc">Newest First</option>
						<option value="createdAt-asc">Oldest First</option>
						<option value="title-asc">Title A-Z</option>
						<option value="title-desc">Title Z-A</option>
						<option value="progress-desc">Highest Progress</option>
						<option value="progress-asc">Lowest Progress</option>
						<option value="deadline-asc">Deadline (Soonest)</option>
						<option value="deadline-desc">Deadline (Latest)</option>
						<option value="priority-asc">Priority (High First)</option>
						<option value="priority-desc">Priority (Low First)</option>
					</select>

					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
						>
							Clear Filters ✕
						</button>
					)}
				</div>
			</div>

			{/* Results Info */}
			<div className="flex items-center justify-between text-sm text-gray-500">
				<span>
					Showing {filteredAndSortedGoals.length} of {goals.length} goals
				</span>
			</div>

			{/* Goals Grid/List */}
			{filteredAndSortedGoals.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-xl">
					<span className="text-6xl mb-4 block">🎯</span>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						{hasActiveFilters ? "No goals match your filters" : "No goals yet"}
					</h3>
					<p className="text-gray-500">
						{hasActiveFilters
							? "Try adjusting your filters or search query"
							: "Create your first goal to start tracking your progress!"}
					</p>
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
						>
							Clear Filters
						</button>
					)}
				</div>
			) : (
				<div
					className={
						viewMode === "grid"
							? "grid grid-cols-1 lg:grid-cols-2 gap-4"
							: "flex flex-col gap-4"
					}
				>
					{filteredAndSortedGoals.map((goal) => (
						<GoalCard
							key={goal.id}
							goal={goal}
							onUpdateProgress={onUpdateProgress}
							onEdit={onEdit}
							onDelete={onDelete}
							onStatusChange={onStatusChange}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default GoalList;
