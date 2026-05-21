export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export function getDefaultMessage(status: number): string {
	switch (status) {
		case 400:
			return "Datos inválidos";
		case 401:
			return "Sesión expirada";
		case 404:
			return "Recurso no encontrado";
		case 408:
			return "La solicitud tardó demasiado";
		case 500:
			return "Error del servidor";
		default:
			return `Error ${status}`;
	}
}
