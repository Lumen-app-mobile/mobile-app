import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { ApiError, getDefaultMessage } from "@/services/api-error";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const MAX_RETRIES = 2;

function isAbsoluteUrl(path: string) {
	return /^https?:\/\//i.test(path);
}

function buildApiUrl(path: string) {
	if (isAbsoluteUrl(path)) return path;

	if (!API_BASE_URL) {
		throw new ApiError("API_BASE_URL_REQUIRED", 0);
	}

	return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function authenticatedFetch(
	path: string,
	options: RequestInit = {},
	timeoutMs = 300_000,
): Promise<Response> {
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new ApiError("AUTH_REQUIRED", 401);
	}

	const idToken = await currentUser.getIdToken();
	const headers = new Headers(options.headers);
	headers.set("Authorization", `Bearer ${idToken}`);

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);

		try {
			const response = await fetch(buildApiUrl(path), {
				...options,
				headers,
				signal: controller.signal,
			});

			if (response.status === 401) {
				await signOut(auth);

				throw new ApiError(getDefaultMessage(401), 401);
			}

			if (response.status >= 500 && attempt < MAX_RETRIES) {
				await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
				continue;
			}

			return response;
		} catch (err) {
			if (err instanceof ApiError) throw err;

			if ((err as Error)?.name === "AbortError") {
				throw new ApiError(getDefaultMessage(408), 408);
			}

			if (attempt === MAX_RETRIES) {
				throw new ApiError("Error de conexión", 0);
			}

			await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
		} finally {
			clearTimeout(timeout);
		}
	}

	throw new ApiError("Error de conexión", 0);
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
	if (response.status === 204) return undefined as T;

	const body = await response.text();

	if (!response.ok) {
		throw new ApiError(
			body || getDefaultMessage(response.status),
			response.status,
		);
	}

	try {
		return JSON.parse(body) as T;
	} catch {
		return body as T;
	}
}
