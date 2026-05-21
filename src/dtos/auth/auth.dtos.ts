export interface RegisterRequestDto {
	username: string;
}

export interface RegisterResponseDto {
	user_id: number;
	token: string;
	email: string;
	username: string;
}
