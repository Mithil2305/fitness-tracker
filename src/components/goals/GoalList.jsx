import { useState, useMemo } from "react";
import GoalCard from "./GoalCard";
import {
	Search,
	Filter,
	LayoutGrid,
	List as ListIcon,
	X,
	Target,
} from "lucide-react";
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
	const [viewMode, setViewMode] = useState("grid");

	const filteredGoals = useMemo(() => {
		return goals.filter((goal) => {
			const matchesSearch = goal.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesCategory =
				filterCategory === "all" || goal.category === filterCategory;
			const matchesStatus =
				filterStatus === "all" || goal.status === filterStatus;
			return matchesSearch && matchesCategory && matchesStatus;
		});
	}, [goals, searchQuery, filterCategory, filterStatus]);

	if (loading)
		return (
			<div className="text-center py-12 text-slate-400 animate-pulse">
				Loading your goals...
			</div>
		);

	return (
		<div className="space-y-6">
			{/* Filter Bar */}
			<div className="bento-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 sticky top-20 z-30 backdrop-blur-md">
				{/* Search */}
				<div className="relative w-full md:w-96">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={18}
					/>
					<input
						type="text"
						placeholder="Search goals..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
					/>
				</div>

				{/* Filters & View Toggle */}
				<div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
					>
						<option value="all">All Categories</option>
						{GOAL_CATEGORIES.map((c) => (
							<option key={c.id} value={c.id}>
								{c.label}
							</option>
						))}
					</select>

					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
					>
						<option value="all">All Status</option>
						{GOAL_STATUSES.map((s) => (
							<option key={s.id} value={s.id}>
								{s.label}
							</option>
						))}
					</select>

					<div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>

					<button
						onClick={() => setViewMode("grid")}
						className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
					>
						<LayoutGrid size={20} />
					</button>
					<button
						onClick={() => setViewMode("list")}
						className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
					>
						<ListIcon size={20} />
					</button>
				</div>
			</div>

			{/* Grid/List Display */}
			{filteredGoals.length === 0 ? (
				<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
					<div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Target size={32} className="text-slate-400" />
					</div>
					<h3 className="text-lg font-bold text-slate-800">No goals found</h3>
					<p className="text-slate-500">
						Adjust your filters or create a new goal.
					</p>
					{(filterCategory !== "all" || searchQuery) && (
						<button
							onClick={() => {
								setFilterCategory("all");
								setSearchQuery("");
							}}
							className="mt-4 text-blue-600 font-medium hover:underline flex items-center justify-center gap-1"
						>
							Clear Filters <X size={14} />
						</button>
					)}
				</div>
			) : (
				<div
					className={
						viewMode === "grid"
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
							: "flex flex-col gap-4"
					}
				>
					{filteredGoals.map((goal) => (
						<GoalCard
							key={goal.id}
							goal={goal}
							onUpdateProgress={onUpdateProgress}
							onEdit={onEdit}
							onDelete={onDelete}
							onStatusChange={onStatusChange}
							viewMode={viewMode}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default GoalList;
