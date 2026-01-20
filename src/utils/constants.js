export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export const WORKOUT_TYPES = [
	"Cardio",
	"Strength",
	"Yoga",
	"HIIT",
	"CrossFit",
	"Swimming",
	"Running",
	"Cycling",
	"Pilates",
	"Boxing",
];

export const CALORIE_GOAL_DEFAULT = 2000;

/* ---------- Goals ---------- */

export const GOAL_CATEGORIES = [
	{ id: "weight", label: "Weight Loss", icon: "⚖️", color: "bg-blue-500" },
	{ id: "strength", label: "Build Strength", icon: "💪", color: "bg-red-500" },
	{
		id: "endurance",
		label: "Improve Endurance",
		icon: "🏃",
		color: "bg-green-500",
	},
	{
		id: "flexibility",
		label: "Flexibility",
		icon: "🧘",
		color: "bg-purple-500",
	},
	{ id: "nutrition", label: "Nutrition", icon: "🥗", color: "bg-yellow-500" },
	{ id: "hydration", label: "Hydration", icon: "💧", color: "bg-cyan-500" },
	{ id: "sleep", label: "Sleep Quality", icon: "😴", color: "bg-indigo-500" },
	{ id: "steps", label: "Daily Steps", icon: "👟", color: "bg-orange-500" },
	{ id: "custom", label: "Custom Goal", icon: "🎯", color: "bg-gray-500" },
];

export const GOAL_PRIORITIES = [
	{ id: "low", label: "Low", color: "text-green-600 bg-green-100" },
	{ id: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-100" },
	{ id: "high", label: "High", color: "text-red-600 bg-red-100" },
];

export const GOAL_STATUSES = [
	{ id: "active", label: "Active", color: "text-blue-600 bg-blue-100" },
	{ id: "completed", label: "Completed", color: "text-green-600 bg-green-100" },
	{ id: "paused", label: "Paused", color: "text-gray-600 bg-gray-100" },
	{ id: "abandoned", label: "Abandoned", color: "text-red-600 bg-red-100" },
];

export const GOAL_UNITS = [
	{ id: "kg", label: "Kilograms (kg)" },
	{ id: "lbs", label: "Pounds (lbs)" },
	{ id: "km", label: "Kilometers (km)" },
	{ id: "miles", label: "Miles" },
	{ id: "minutes", label: "Minutes" },
	{ id: "hours", label: "Hours" },
	{ id: "reps", label: "Repetitions" },
	{ id: "sets", label: "Sets" },
	{ id: "steps", label: "Steps" },
	{ id: "glasses", label: "Glasses" },
	{ id: "calories", label: "Calories" },
	{ id: "percent", label: "Percentage (%)" },
	{ id: "days", label: "Days" },
	{ id: "custom", label: "Custom" },
];

export const GOAL_FREQUENCIES = [
	{ id: "daily", label: "Daily" },
	{ id: "weekly", label: "Weekly" },
	{ id: "monthly", label: "Monthly" },
	{ id: "one-time", label: "One-time" },
];
