import {
	type User,
	createUserWithEmailAndPassword,
	onIdTokenChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { ApiError } from "@/services/api-error";
import { auth } from "@/services/firebase";

const ID_TOKEN_KEY = "id_token";
const USER_ID_KEY = "user_id";
const USERNAME_KEY = "username";

export type AuthContextValue = {
	user: User | null;
	idToken: string | null;
	userId: number | null;
	isInitializing: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, username: string) => Promise<void>;
	logout: () => Promise<void>;
	getIdToken: (forceRefresh?: boolean) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildApiUrl(path: string): string {
	const base = process.env.EXPO_PUBLIC_API_BASE_URL;

	if (!base) throw new Error("API_BASE_URL_REQUIRED");
	return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function registerInApi(username: string): Promise<number> {
	const currentUser = auth.currentUser;

	if (!currentUser) throw new Error("AUTH_REQUIRED");

	const idToken = await currentUser.getIdToken();
	const response = await fetch(buildApiUrl("api/auth/register"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
		body: JSON.stringify({ username }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new ApiError(text || "REGISTER_FAILED", response.status);
	}

	const data = await response.json();

	return data.user_id;
}

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<User | null>(auth.currentUser);
	const [idToken, setIdToken] = useState<string | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (!currentUser) {
				setIdToken(null);
				setUserId(null);
				await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
				setIsInitializing(false);
				return;
			}

			try {
				const currentToken = await currentUser.getIdToken();
				setIdToken(currentToken);
				await SecureStore.setItemAsync(ID_TOKEN_KEY, currentToken);
			} catch {
				setIdToken(null);
			} finally {
				setIsInitializing(false);
			}
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		SecureStore.getItemAsync(ID_TOKEN_KEY).then((stored) => {
			if (stored && !idToken) setIdToken(stored);
		});
	}, []);

	useEffect(() => {
		if (!user) {
			setUserId(null);
			return;
		}

		SecureStore.getItemAsync(USER_ID_KEY).then((stored) => {
			if (stored) setUserId(Number(stored));
		});
	}, [user]);

	const signIn = useCallback(async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email.trim(),
			password,
		);
		const currentToken = await userCredential.user.getIdToken();

		setUser(userCredential.user);
		setIdToken(currentToken);

		const storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
		const username = storedUsername || email.split("@")[0];

		try {
			const uid = await registerInApi(username);
			setUserId(uid);
			await SecureStore.setItemAsync(USER_ID_KEY, String(uid));
			await SecureStore.setItemAsync(USERNAME_KEY, username);
		} catch {
			// Usuario ya registrado o error de red — la app funciona igual sin user_id
		}
	}, []);

	const register = useCallback(
		async (email: string, password: string, username: string) => {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email.trim(),
				password,
			);
			const currentToken = await userCredential.user.getIdToken();

			setUser(userCredential.user);
			setIdToken(currentToken);

			const uid = await registerInApi(username);
			setUserId(uid);

			await SecureStore.setItemAsync(USER_ID_KEY, String(uid));
			await SecureStore.setItemAsync(USERNAME_KEY, username);
		},
		[],
	);

	const logout = useCallback(async () => {
		await signOut(auth);
		setUser(null);
		setIdToken(null);
		setUserId(null);

		await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
		await SecureStore.deleteItemAsync(USER_ID_KEY);
		await SecureStore.deleteItemAsync(USERNAME_KEY);
	}, []);

	const getIdToken = useCallback(async (forceRefresh = false) => {
		const currentUser = auth.currentUser;

		if (!currentUser) {
			throw new Error("AUTH_REQUIRED");
		}

		const currentToken = await currentUser.getIdToken(forceRefresh);
		setIdToken(currentToken);

		return currentToken;
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			idToken,
			userId,
			isInitializing,
			signIn,
			register,
			logout,
			getIdToken,
		}),
		[user, idToken, userId, isInitializing, signIn, register, logout, getIdToken],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return context;
}
