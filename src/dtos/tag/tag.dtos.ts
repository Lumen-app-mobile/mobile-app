export interface TagDto {
	id: number;
	name: string;
	user_id: number | null;
	created_at: string;
	updated_at: string;
}

export interface CreateTagRequestDto {
	name: string;
	user_id?: number | null;
}

export interface UpdateTagRequestDto {
	name?: string;
}
