import { useState } from "react";
import {
	GOAL_CATEGORIES,
	GOAL_PRIORITIES,
	GOAL_UNITS,
	GOAL_FREQUENCIES,
} from "../../utils/constants";

const GoalForm = ({ onSubmit, initialData = null, onCancel }) => {
	const [formData, setFormData] = useState({
		title: initialData?.title || "",
		description: initialData?.description || "",
		category: initialData?.category || "custom",
		priority: initialData?.priority || "medium",
		targetValue: initialData?.targetValue || "",
		startValue: initialData?.startValue || 0,
		unit: initialData?.unit || "custom",
		customUnit: initialData?.customUnit || "",
		frequency: initialData?.frequency || "one-time",
		deadline: initialData?.deadline || "",
		reminderEnabled: initialData?.reminderEnabled || false,
		reminderTime: initialData?.reminderTime || "09:00",
		notes: initialData?.notes || "",
		milestones: initialData?.milestones || [],
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [newMilestone, setNewMilestone] = useState({
		title: "",
		targetValue: "",
	});

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Goal title is required";
		} else if (formData.title.length < 3) {
			newErrors.title = "Title must be at least 3 characters";
		}

		if (!formData.targetValue || parseFloat(formData.targetValue) <= 0) {
			newErrors.targetValue = "Target value must be greater than 0";
		}

		if (formData.unit === "custom" && !formData.customUnit.trim()) {
			newErrors.customUnit = "Please specify a custom unit";
		}

		if (formData.deadline) {
			const deadlineDate = new Date(formData.deadline);
			if (deadlineDate < new Date()) {
				newErrors.deadline = "Deadline cannot be in the past";
			}
		}

		if (parseFloat(formData.startValue) >= parseFloat(formData.targetValue)) {
			newErrors.startValue = "Start value must be less than target value";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleAddMilestone = () => {
		if (newMilestone.title && newMilestone.targetValue) {
			setFormData((prev) => ({
				...prev,
				milestones: [
					...prev.milestones,
					{ ...newMilestone, id: Date.now(), completed: false },
				],
			}));
			setNewMilestone({ title: "", targetValue: "" });
		}
	};

	const handleRemoveMilestone = (id) => {
		setFormData((prev) => ({
			...prev,
			milestones: prev.milestones.filter((m) => m.id !== id),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const submitData = {
				...formData,
				targetValue: parseFloat(formData.targetValue),
				startValue: parseFloat(formData.startValue) || 0,
				unit: formData.unit === "custom" ? formData.customUnit : formData.unit,
			};
			await onSubmit(submitData);
		} catch (error) {
			console.error("Error submitting goal:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedCategory = GOAL_CATEGORIES.find(
		(c) => c.id === formData.category,
	);

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white rounded-xl shadow-lg p-6 space-y-6"
		>
			{/* Header */}
			<div className="flex items-center gap-3 pb-4 border-b">
				<span className="text-3xl">{selectedCategory?.icon || "🎯"}</span>
				<div>
					<h2 className="text-xl font-bold text-gray-800">
						{initialData ? "Edit Goal" : "Create New Goal"}
					</h2>
					<p className="text-sm text-gray-500">
						Set a clear, measurable goal to track your progress
					</p>
				</div>
			</div>

			{/* Category Selection */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Goal Category
				</label>
				<div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
					{GOAL_CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() =>
								handleChange({ target: { name: "category", value: cat.id } })
							}
							className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
								formData.category === cat.id
									? `border-blue-500 bg-blue-50`
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<span className="text-2xl mb-1">{cat.icon}</span>
							<span className="text-xs text-center font-medium">
								{cat.label}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Title & Description */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Goal Title *
					</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="e.g., Lose 10 kg by summer"
						className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							errors.title ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">{errors.title}</p>
					)}
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Why is this goal important to you? How will you achieve it?"
						rows={3}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>

			{/* Target Values */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Start Value
					</label>
					<input
						type="number"
						name="startValue"
						value={formData.startValue}
						onChange={handleChange}
						placeholder="0"
						min="0"
						step="0.1"
						className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							errors.startValue ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.startValue && (
						<p className="text-red-500 text-sm mt-1">{errors.startValue}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Target Value *
					</label>
					<input
						type="number"
						name="targetValue"
						value={formData.targetValue}
						onChange={handleChange}
						placeholder="e.g., 10"
						min="0"
						step="0.1"
						className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							errors.targetValue ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.targetValue && (
						<p className="text-red-500 text-sm mt-1">{errors.targetValue}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Unit
					</label>
					<select
						name="unit"
						value={formData.unit}
						onChange={handleChange}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{GOAL_UNITS.map((unit) => (
							<option key={unit.id} value={unit.id}>
								{unit.label}
							</option>
						))}
					</select>
				</div>

				{formData.unit === "custom" && (
					<div className="md:col-span-3">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Custom Unit *
						</label>
						<input
							type="text"
							name="customUnit"
							value={formData.customUnit}
							onChange={handleChange}
							placeholder="e.g., workouts, books, etc."
							className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.customUnit ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.customUnit && (
							<p className="text-red-500 text-sm mt-1">{errors.customUnit}</p>
						)}
					</div>
				)}
			</div>

			{/* Priority & Frequency */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Priority
					</label>
					<div className="flex gap-2">
						{GOAL_PRIORITIES.map((priority) => (
							<button
								key={priority.id}
								type="button"
								onClick={() =>
									handleChange({
										target: { name: "priority", value: priority.id },
									})
								}
								className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
									formData.priority === priority.id
										? priority.color + " ring-2 ring-offset-1"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{priority.label}
							</button>
						))}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Frequency
					</label>
					<select
						name="frequency"
						value={formData.frequency}
						onChange={handleChange}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{GOAL_FREQUENCIES.map((freq) => (
							<option key={freq.id} value={freq.id}>
								{freq.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Deadline
					</label>
					<input
						type="date"
						name="deadline"
						value={formData.deadline}
						onChange={handleChange}
						min={new Date().toISOString().split("T")[0]}
						className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							errors.deadline ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.deadline && (
						<p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
					)}
				</div>
			</div>

			{/* Advanced Options Toggle */}
			<button
				type="button"
				onClick={() => setShowAdvanced(!showAdvanced)}
				className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
			>
				<span>{showAdvanced ? "▼" : "▶"}</span>
				Advanced Options
			</button>

			{/* Advanced Options */}
			{showAdvanced && (
				<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
					{/* Milestones */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Milestones (Optional)
						</label>
						<p className="text-xs text-gray-500 mb-3">
							Break your goal into smaller milestones to track progress
						</p>

						{formData.milestones.length > 0 && (
							<div className="space-y-2 mb-3">
								{formData.milestones.map((milestone, idx) => (
									<div
										key={milestone.id}
										className="flex items-center gap-2 bg-white p-2 rounded-lg border"
									>
										<span className="text-sm font-medium text-gray-400">
											#{idx + 1}
										</span>
										<span className="flex-1 text-sm">{milestone.title}</span>
										<span className="text-sm text-gray-500">
											{milestone.targetValue}{" "}
											{formData.unit === "custom"
												? formData.customUnit
												: formData.unit}
										</span>
										<button
											type="button"
											onClick={() => handleRemoveMilestone(milestone.id)}
											className="text-red-500 hover:text-red-700"
										>
											✕
										</button>
									</div>
								))}
							</div>
						)}

						<div className="flex gap-2">
							<input
								type="text"
								value={newMilestone.title}
								onChange={(e) =>
									setNewMilestone((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								placeholder="Milestone title"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
							/>
							<input
								type="number"
								value={newMilestone.targetValue}
								onChange={(e) =>
									setNewMilestone((prev) => ({
										...prev,
										targetValue: e.target.value,
									}))
								}
								placeholder="Value"
								className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
							/>
							<button
								type="button"
								onClick={handleAddMilestone}
								disabled={!newMilestone.title || !newMilestone.targetValue}
								className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
							>
								Add
							</button>
						</div>
					</div>

					{/* Reminder */}
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								name="reminderEnabled"
								checked={formData.reminderEnabled}
								onChange={handleChange}
								className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm font-medium text-gray-700">
								Enable daily reminder
							</span>
						</label>

						{formData.reminderEnabled && (
							<input
								type="time"
								name="reminderTime"
								value={formData.reminderTime}
								onChange={handleChange}
								className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
							/>
						)}
					</div>

					{/* Notes */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Additional Notes
						</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							placeholder="Any additional notes, motivation, or strategy..."
							rows={2}
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
						/>
					</div>
				</div>
			)}

			{/* Submit Buttons */}
			<div className="flex gap-3 pt-4 border-t">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
				)}
				<button
					type="submit"
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
				>
					{isSubmitting ? (
						<span className="flex items-center justify-center gap-2">
							<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Saving...
						</span>
					) : (
						<>{initialData ? "Update Goal" : "Create Goal"}</>
					)}
				</button>
			</div>
		</form>
	);
};

export default GoalForm;
