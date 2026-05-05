import {
	type User,
	onIdTokenChanged,
	signOut,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { auth } from "@/services/firebase";

export type AuthContextValue = {
	user: User | null;
	idToken: string | null;
	isInitializing: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	getIdToken: (forceRefresh?: boolean) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<User | null>(auth.currentUser);
	const [idToken, setIdToken] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (!currentUser) {
				setIdToken(null);
				setIsInitializing(false);
				return;
			}

			try {
				const currentToken = await currentUser.getIdToken();
				setIdToken(currentToken);
			} catch {
				setIdToken(null);
			} finally {
				setIsInitializing(false);
			}
		});

		return unsubscribe;
	}, []);

	const signIn = useCallback(async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email.trim(),
			password,
		);
		const currentToken = await userCredential.user.getIdToken();

		setUser(userCredential.user);
		setIdToken(currentToken);
	}, []);

	const logout = useCallback(async () => {
		await signOut(auth);
		setUser(null);
		setIdToken(null);
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
			isInitializing,
			signIn,
			logout,
			getIdToken,
		}),
		[user, idToken, isInitializing, signIn, logout, getIdToken],
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
