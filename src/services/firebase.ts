import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBQFYAf8KH3KNMHcR8sOxoq8GllNk80NSA",
	authDomain: "lumen-d1c2d.firebaseapp.com",
	projectId: "lumen-d1c2d",
	storageBucket: "lumen-d1c2d.firebasestorage.app",
	messagingSenderId: "965229085577",
	appId: "1:965229085577:web:05b863578ea2e49edf1758",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
