import { useState } from "react";
import {
	GOAL_CATEGORIES,
	GOAL_PRIORITIES,
	GOAL_UNITS,
} from "../../utils/constants";
import {
	X,
	Save,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Plus,
	Minus,
} from "lucide-react";

const GoalForm = ({ onSubmit, initialData = null, onCancel }) => {
	const [formData, setFormData] = useState({
		title: initialData?.title || "",
		description: initialData?.description || "",
		category: initialData?.category || GOAL_CATEGORIES[0]?.id,
		priority: initialData?.priority || "medium",
		targetValue: initialData?.targetValue || "",
		startValue: initialData?.startValue || 0,
		unit: initialData?.unit || "kg",
		deadline: initialData?.deadline || "",
		milestones: initialData?.milestones || [],
	});

	const [showAdvanced, setShowAdvanced] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.targetValue) return;

		setIsSubmitting(true);
		await onSubmit({
			...formData,
			targetValue: parseFloat(formData.targetValue),
			startValue: parseFloat(formData.startValue),
			currentValue: initialData
				? initialData.currentValue
				: parseFloat(formData.startValue),
		});
		setIsSubmitting(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="bento-card p-6 md:p-8 bg-white relative animate-fade-in-up">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">
						{initialData ? "Edit Goal" : "Create New Goal"}
					</h2>
					<p className="text-slate-500 text-sm">
						Define your target and track your success.
					</p>
				</div>
				<button
					onClick={onCancel}
					className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
				>
					<X size={24} />
				</button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Info Group */}
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">
							Goal Title
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							placeholder="e.g., Run a Marathon"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-1.5">
								Category
							</label>
							<div className="relative">
								<select
									name="category"
									value={formData.category}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
								>
									{GOAL_CATEGORIES.map((c) => (
										<option key={c.id} value={c.id}>
											{c.label}
										</option>
									))}
								</select>
								<ChevronDown
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
									size={16}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-1.5">
								Priority
							</label>
							<div className="flex gap-2">
								{GOAL_PRIORITIES.map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() =>
											setFormData((prev) => ({ ...prev, priority: p.id }))
										}
										className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
											formData.priority === p.id
												? "bg-slate-800 text-white border-slate-800 shadow-md"
												: "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
										}`}
									>
										{p.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Targets Group */}
				<div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
					<h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
						Target Metrics
					</h3>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-1">
							<label className="block text-xs font-semibold text-slate-500 mb-1">
								Start
							</label>
							<input
								type="number"
								name="startValue"
								value={formData.startValue}
								onChange={handleChange}
								className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							/>
						</div>
						<div className="col-span-1">
							<label className="block text-xs font-semibold text-slate-500 mb-1">
								Target
							</label>
							<input
								type="number"
								name="targetValue"
								value={formData.targetValue}
								onChange={handleChange}
								className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
								required
							/>
						</div>
						<div className="col-span-1">
							<label className="block text-xs font-semibold text-slate-500 mb-1">
								Unit
							</label>
							<select
								name="unit"
								value={formData.unit}
								onChange={handleChange}
								className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							>
								{GOAL_UNITS.map((u) => (
									<option key={u.id} value={u.id}>
										{u.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-500 mb-1">
							Deadline (Optional)
						</label>
						<input
							type="date"
							name="deadline"
							value={formData.deadline}
							onChange={handleChange}
							className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>
				</div>

				{/* Advanced Accordion */}
				<div>
					<button
						type="button"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
					>
						{showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						{showAdvanced ? "Hide Details" : "Add Description & Notes"}
					</button>

					{showAdvanced && (
						<div className="mt-4 animate-fade-in-up">
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Why is this goal important? Add motivation or strategy..."
								rows="3"
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
							/>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-4 pt-4 border-t border-slate-100">
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 px-6 py-3.5 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
					>
						{isSubmitting ? (
							"Saving..."
						) : (
							<>
								<Save size={18} /> Save Goal
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default GoalForm;
