import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper to strip surrounding quotes if present in .env values
const normalize = (v) => {
	if (typeof v !== "string") return v;
	return v.replace(/^['"]|['"]$/g, "");
};

const firebaseConfig = {
	apiKey: normalize(import.meta.env.VITE_FIREBASE_API_KEY),
	authDomain: normalize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
	projectId: normalize(import.meta.env.VITE_FIREBASE_PROJECT_ID),
	storageBucket: normalize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
	messagingSenderId: normalize(
		import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	),
	appId: normalize(import.meta.env.VITE_FIREBASE_APP_ID),
};

// Basic runtime checks to provide clearer errors during development
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
	console.error(
		"Firebase config appears incomplete. Check your .env and ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set. Current config:",
		firebaseConfig,
	);
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
