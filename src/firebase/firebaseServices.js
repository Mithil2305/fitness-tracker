import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	getDocs,
	getDoc,
	updateDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/* ---------- Meals ---------- */

export const addMeal = async (userId, meal) => {
	return await addDoc(collection(db, "meals"), {
		...meal,
		userId,
		createdAt: serverTimestamp(),
	});
};

export const getMeals = async (userId) => {
	const q = query(
		collection(db, "meals"),
		where("userId", "==", userId),
		orderBy("createdAt", "desc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

export const deleteMeal = async (id) => {
	return await deleteDoc(doc(db, "meals", id));
};

/* ---------- Workouts ---------- */

export const addWorkout = async (userId, workout) => {
	return await addDoc(collection(db, "workouts"), {
		...workout,
		userId,
		createdAt: serverTimestamp(),
	});
};

export const getWorkouts = async (userId) => {
	const q = query(
		collection(db, "workouts"),
		where("userId", "==", userId),
		orderBy("createdAt", "desc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

export const deleteWorkout = async (id) => {
	return await deleteDoc(doc(db, "workouts", id));
};

/* ---------- Goals ---------- */

export const addGoal = async (userId, goal) => {
	return await addDoc(collection(db, "goals"), {
		...goal,
		userId,
		currentValue: goal.startValue || 0,
		status: "active",
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
};

export const getGoals = async (userId) => {
	const q = query(
		collection(db, "goals"),
		where("userId", "==", userId),
		orderBy("createdAt", "desc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((d) => ({
		id: d.id,
		...d.data(),
	}));
};

export const getGoal = async (id) => {
	const docRef = doc(db, "goals", id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	}
	return null;
};

export const updateGoal = async (id, updates) => {
	const docRef = doc(db, "goals", id);
	return await updateDoc(docRef, {
		...updates,
		updatedAt: serverTimestamp(),
	});
};

export const updateGoalProgress = async (id, newValue) => {
	const docRef = doc(db, "goals", id);
	return await updateDoc(docRef, {
		currentValue: newValue,
		updatedAt: serverTimestamp(),
	});
};

export const deleteGoal = async (id) => {
	return await deleteDoc(doc(db, "goals", id));
};

/* ---------- Goal Milestones ---------- */

export const addMilestone = async (goalId, milestone) => {
	return await addDoc(collection(db, "milestones"), {
		...milestone,
		goalId,
		completed: false,
		createdAt: serverTimestamp(),
	});
};

export const getMilestones = async (goalId) => {
	const q = query(
		collection(db, "milestones"),
		where("goalId", "==", goalId),
		orderBy("targetValue", "asc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((d) => ({
		id: d.id,
		...d.data(),
	}));
};

export const updateMilestone = async (id, updates) => {
	const docRef = doc(db, "milestones", id);
	return await updateDoc(docRef, updates);
};

export const deleteMilestone = async (id) => {
	return await deleteDoc(doc(db, "milestones", id));
};
