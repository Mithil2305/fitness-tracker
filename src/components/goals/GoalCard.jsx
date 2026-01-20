import { useState } from "react";
import {
	GOAL_CATEGORIES,
	GOAL_PRIORITIES,
	GOAL_STATUSES,
} from "../../utils/constants";

const GoalCard = ({
	goal,
	onUpdateProgress,
	onEdit,
	onDelete,
	onStatusChange,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [progressInput, setProgressInput] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [showProgressInput, setShowProgressInput] = useState(false);

	const category =
		GOAL_CATEGORIES.find((c) => c.id === goal.category) || GOAL_CATEGORIES[8];
	const priority =
		GOAL_PRIORITIES.find((p) => p.id === goal.priority) || GOAL_PRIORITIES[1];
	const status =
		GOAL_STATUSES.find((s) => s.id === goal.status) || GOAL_STATUSES[0];

	const progress = Math.min(
		100,
		Math.round(
			((goal.currentValue - (goal.startValue || 0)) /
				(goal.targetValue - (goal.startValue || 0))) *
				100,
		),
	);

	const daysRemaining = goal.deadline
		? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
		: null;

	const isOverdue = daysRemaining !== null && daysRemaining < 0;
	const isNearDeadline =
		daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

	const handleProgressUpdate = async () => {
		if (!progressInput) return;
		setIsUpdating(true);
		try {
			await onUpdateProgress(goal.id, parseFloat(progressInput));
			setProgressInput("");
			setShowProgressInput(false);
		} catch (error) {
			console.error("Error updating progress:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const getProgressColor = () => {
		if (progress >= 100) return "bg-green-500";
		if (progress >= 75) return "bg-blue-500";
		if (progress >= 50) return "bg-yellow-500";
		if (progress >= 25) return "bg-orange-500";
		return "bg-red-500";
	};

	return (
		<div
			className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${category.color}`}
		>
			{/* Header */}
			<div className="p-5">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<span className="text-3xl">{category.icon}</span>
						<div>
							<h3 className="font-bold text-gray-800 text-lg">{goal.title}</h3>
							<div className="flex items-center gap-2 mt-1">
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.color}`}
								>
									{priority.label}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}
								>
									{status.label}
								</span>
								{goal.frequency && goal.frequency !== "one-time" && (
									<span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
										{goal.frequency}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1">
						<button
							onClick={() => onEdit(goal)}
							className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
							title="Edit goal"
						>
							✏️
						</button>
						<button
							onClick={() => onDelete(goal.id)}
							className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
							title="Delete goal"
						>
							🗑️
						</button>
					</div>
				</div>

				{goal.description && (
					<p className="text-gray-600 text-sm mt-3 line-clamp-2">
						{goal.description}
					</p>
				)}

				{/* Progress Section */}
				<div className="mt-4">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-baseline gap-2">
							<span className="text-2xl font-bold text-gray-800">
								{goal.currentValue}
							</span>
							<span className="text-gray-400">/</span>
							<span className="text-lg text-gray-600">{goal.targetValue}</span>
							<span className="text-sm text-gray-500">{goal.unit}</span>
						</div>
						<span
							className={`text-lg font-bold ${progress >= 100 ? "text-green-500" : "text-blue-600"}`}
						>
							{progress}%
						</span>
					</div>

					{/* Progress Bar */}
					<div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
						<div
							className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor()}`}
							style={{ width: `${Math.min(progress, 100)}%` }}
						/>
						{/* Milestone markers */}
						{goal.milestones?.map((m) => {
							const milestonePos =
								((m.targetValue - (goal.startValue || 0)) /
									(goal.targetValue - (goal.startValue || 0))) *
								100;
							return (
								<div
									key={m.id}
									className="absolute top-0 w-0.5 h-full bg-gray-400"
									style={{ left: `${milestonePos}%` }}
									title={m.title}
								/>
							);
						})}
					</div>

					{/* Quick Progress Update */}
					{goal.status === "active" && (
						<div className="mt-3">
							{showProgressInput ? (
								<div className="flex gap-2">
									<input
										type="number"
										value={progressInput}
										onChange={(e) => setProgressInput(e.target.value)}
										placeholder={`New value (${goal.unit})`}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
										min={goal.startValue || 0}
										max={goal.targetValue}
										step="0.1"
									/>
									<button
										onClick={handleProgressUpdate}
										disabled={isUpdating || !progressInput}
										className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
									>
										{isUpdating ? "..." : "Update"}
									</button>
									<button
										onClick={() => {
											setShowProgressInput(false);
											setProgressInput("");
										}}
										className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
									>
										✕
									</button>
								</div>
							) : (
								<button
									onClick={() => setShowProgressInput(true)}
									className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium"
								>
									+ Log Progress
								</button>
							)}
						</div>
					)}
				</div>

				{/* Deadline & Stats */}
				<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
					<div className="flex items-center gap-4 text-sm">
						{daysRemaining !== null && (
							<span
								className={`flex items-center gap-1 ${
									isOverdue
										? "text-red-500"
										: isNearDeadline
											? "text-orange-500"
											: "text-gray-500"
								}`}
							>
								<span>📅</span>
								{isOverdue
									? `${Math.abs(daysRemaining)} days overdue`
									: daysRemaining === 0
										? "Due today"
										: `${daysRemaining} days left`}
							</span>
						)}
						{goal.reminderEnabled && (
							<span className="flex items-center gap-1 text-gray-500">
								<span>🔔</span>
								{goal.reminderTime}
							</span>
						)}
					</div>

					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
					>
						{isExpanded ? "Less" : "More"}
						<span
							className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
						>
							▼
						</span>
					</button>
				</div>
			</div>

			{/* Expanded Section */}
			{isExpanded && (
				<div className="px-5 pb-5 space-y-4 bg-gray-50 border-t">
					{/* Milestones */}
					{goal.milestones && goal.milestones.length > 0 && (
						<div className="pt-4">
							<h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
								🏁 Milestones
							</h4>
							<div className="space-y-2">
								{goal.milestones.map((milestone, idx) => {
									const isCompleted =
										goal.currentValue >= milestone.targetValue;
									return (
										<div
											key={milestone.id || idx}
											className={`flex items-center gap-3 p-2 rounded-lg ${
												isCompleted ? "bg-green-50" : "bg-white"
											}`}
										>
											<span
												className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
													isCompleted
														? "bg-green-500 text-white"
														: "bg-gray-200 text-gray-500"
												}`}
											>
												{isCompleted ? "✓" : idx + 1}
											</span>
											<span
												className={`flex-1 ${isCompleted ? "line-through text-gray-400" : ""}`}
											>
												{milestone.title}
											</span>
											<span className="text-sm text-gray-500">
												{milestone.targetValue} {goal.unit}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Notes */}
					{goal.notes && (
						<div>
							<h4 className="font-medium text-gray-700 mb-1 flex items-center gap-2">
								📝 Notes
							</h4>
							<p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
								{goal.notes}
							</p>
						</div>
					)}

					{/* Status Actions */}
					<div className="flex gap-2 pt-2">
						{goal.status === "active" && (
							<>
								<button
									onClick={() => onStatusChange(goal.id, "completed")}
									className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
								>
									✓ Mark Complete
								</button>
								<button
									onClick={() => onStatusChange(goal.id, "paused")}
									className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
								>
									⏸ Pause Goal
								</button>
							</>
						)}
						{goal.status === "paused" && (
							<button
								onClick={() => onStatusChange(goal.id, "active")}
								className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
							>
								▶ Resume Goal
							</button>
						)}
						{goal.status === "completed" && (
							<div className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg text-center">
								🎉 Goal Completed!
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default GoalCard;
