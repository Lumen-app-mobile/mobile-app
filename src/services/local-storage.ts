import AsyncStorage from "@react-native-async-storage/async-storage";

const SALARY_KEY = "@lumen/salary";

export async function getSalary(): Promise<number | null> {
	try {
		const value = await AsyncStorage.getItem(SALARY_KEY);
		if (value === null) return null;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export async function setSalary(cents: number): Promise<void> {
	try {
		await AsyncStorage.setItem(SALARY_KEY, String(cents));
	} catch {
		console.warn("[LocalStorage] Failed to save salary");
	}
}

export async function clearSalary(): Promise<void> {
	try {
		await AsyncStorage.removeItem(SALARY_KEY);
	} catch {
		console.warn("[LocalStorage] Failed to clear salary");
	}
}
