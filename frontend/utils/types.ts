export type Category = {
	id?: number;
	name: string;
};
export type User = {
	id?: number;
	first_name: string;
	last_name: string;
	name?: string; // Optional for user details, required for registration
	email: string;
	password?: string; // Optional for user details, required for registration
};
