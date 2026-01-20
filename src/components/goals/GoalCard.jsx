import {
	MoreVertical,
	Calendar,
	Check,
	Edit3,
	Trash2,
	PlayCircle,
	PauseCircle,
	Flag,
	Flame,
	Dumbbell,
	Utensils,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { GOAL_CATEGORIES } from "../../utils/constants";

const GoalCard = ({
	goal,
	onUpdateProgress,
	onEdit,
	onDelete,
	onStatusChange,
	viewMode,
}) => {
	const [showMenu, setShowMenu] = useState(false);

	// Calculate Progress
	const current = parseFloat(goal.currentValue || 0);
	const target = parseFloat(goal.targetValue || 1);
	const start = parseFloat(goal.startValue || 0);
	const percent = Math.min(
		100,
		Math.max(0, Math.round(((current - start) / (target - start)) * 100)),
	);

	// Icons Helper
	const getCategoryIcon = (id) => {
		switch (id) {
			case "weight-loss":
				return <Flame size={18} />;
			case "muscle-gain":
				return <Dumbbell size={18} />;
			case "nutrition":
				return <Utensils size={18} />;
			default:
				return <Zap size={18} />;
		}
	};

	const getPriorityColor = (p) => {
		switch (p) {
			case "high":
				return "bg-rose-100 text-rose-700 border-rose-200";
			case "medium":
				return "bg-amber-100 text-amber-700 border-amber-200";
			default:
				return "bg-blue-100 text-blue-700 border-blue-200";
		}
	};

	return (
		<div
			className={`bento-card group relative bg-white border border-slate-100 overflow-visible transition-all duration-300 hover:shadow-lg ${viewMode === "list" ? "flex flex-row items-center gap-6 p-4" : "flex flex-col p-6"}`}
		>
			{/* Header / Icon */}
			<div
				className={`flex justify-between items-start ${viewMode === "list" ? "w-1/4" : "w-full mb-4"}`}
			>
				<div className="flex items-center gap-3">
					<div
						className={`p-3 rounded-xl ${goal.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"}`}
					>
						{getCategoryIcon(goal.category)}
					</div>
					<div className={viewMode === "list" ? "" : "flex-1"}>
						<div
							className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-1 border ${getPriorityColor(goal.priority)}`}
						>
							{goal.priority}
						</div>
						<h3 className="font-bold text-slate-800 line-clamp-1 text-lg">
							{goal.title}
						</h3>
					</div>
				</div>

				{/* Dropdown Menu */}
				<div className="relative">
					<button
						onClick={() => setShowMenu(!showMenu)}
						className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
					>
						<MoreVertical size={18} />
					</button>

					{showMenu && (
						<>
							<div
								className="fixed inset-0 z-10"
								onClick={() => setShowMenu(false)}
							/>
							<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 animate-fade-in-up">
								<button
									onClick={() => onEdit(goal)}
									className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
								>
									<Edit3 size={14} /> Edit Goal
								</button>
								<button
									onClick={() =>
										onStatusChange(
											goal.id,
											goal.status === "active" ? "paused" : "active",
										)
									}
									className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
								>
									{goal.status === "active" ? (
										<PauseCircle size={14} />
									) : (
										<PlayCircle size={14} />
									)}
									{goal.status === "active" ? "Pause" : "Resume"}
								</button>
								<div className="h-px bg-slate-100 my-1"></div>
								<button
									onClick={() => onDelete(goal.id)}
									className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
								>
									<Trash2 size={14} /> Delete
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Progress Section */}
			<div className={`flex-1 ${viewMode === "list" ? "w-2/4" : "w-full"}`}>
				<div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
					<span>
						{current}{" "}
						<span className="text-slate-400 text-xs">{goal.unit}</span>
					</span>
					<span>
						{target} <span className="text-slate-400 text-xs">{goal.unit}</span>
					</span>
				</div>

				<div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
					<div
						className={`h-full rounded-full transition-all duration-1000 ease-out relative ${goal.status === "completed" ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
						style={{ width: `${percent}%` }}
					>
						<div className="absolute inset-0 bg-white/20 animate-pulse"></div>
					</div>
				</div>

				{/* Quick Log Buttons */}
				{goal.status === "active" && (
					<div className="flex gap-2">
						<button
							onClick={() => onUpdateProgress(goal.id, current + 1)}
							className="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
						>
							+1
						</button>
						<button
							onClick={() => {
								const val = prompt("Enter new value:", current);
								if (val) onUpdateProgress(goal.id, parseFloat(val));
							}}
							className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
						>
							Set
						</button>
					</div>
				)}
			</div>

			{/* Footer / Meta */}
			<div
				className={`text-xs text-slate-400 flex items-center gap-3 ${viewMode === "list" ? "w-1/4 justify-end" : "mt-4 pt-4 border-t border-slate-50 w-full"}`}
			>
				{goal.deadline && (
					<div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
						<Calendar size={12} />
						{new Date(goal.deadline).toLocaleDateString()}
					</div>
				)}
				{goal.milestones?.length > 0 && (
					<div className="flex items-center gap-1.5">
						<Flag size={12} />
						{goal.milestones.filter((m) => m.completed).length}/
						{goal.milestones.length}
					</div>
				)}
			</div>
		</div>
	);
};

export default GoalCard;
