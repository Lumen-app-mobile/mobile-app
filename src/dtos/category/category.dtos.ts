export interface CategoryDto {
	id: number;
	name: string;
	type: "income" | "expense";
	created_at: string;
	updated_at: string;
}
