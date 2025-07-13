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

export type RegisterFormState = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};
export type RegisterUser = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};
