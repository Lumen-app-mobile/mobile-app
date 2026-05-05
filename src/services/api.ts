import { auth } from "@/services/firebase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function isAbsoluteUrl(path: string) {
	return /^https?:\/\//i.test(path);
}

function buildApiUrl(path: string) {
	if (isAbsoluteUrl(path)) return path;

	if (!API_BASE_URL) {
		throw new Error("API_BASE_URL_REQUIRED");
	}

	return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function authenticatedFetch(
	path: string,
	options: RequestInit = {},
): Promise<Response> {
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("AUTH_REQUIRED");
	}

	const idToken = await currentUser.getIdToken();
	const headers = new Headers(options.headers);
	headers.set("Authorization", `Bearer ${idToken}`);

	return fetch(buildApiUrl(path), {
		...options,
		headers,
	});
}
