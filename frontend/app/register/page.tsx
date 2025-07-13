"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { type RegisterUser, type RegisterFormState } from "@/utils/types"; // Fixed typo: RegsiterUser -> RegisterUser
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const initialFormState: RegisterFormState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
};

function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState<RegisterFormState>(initialFormState);
	const { post } = useApi();
	const { login } = useAuth();

	// Add password confirmation validation
	const validateForm = () => {
		if (form.password !== form.confirmPassword) {
			toast.error("Passwords do not match!");
			return false;
		}
		if (form.password.length < 6) {
			toast.error("Password must be at least 6 characters long!");
			return false;
		}
		return true;
	};

	// for user registration
	const registerMutation = useMutation({
		mutationFn: (newUser: RegisterUser) => post("/auth/register/", newUser), // Fixed typo: regiserMutation -> registerMutation
		onSuccess: async (data) => {
			console.log("Registration successful", data);
			toast.success("Registration successful!");

			// Auto-login after successful registration
			try {
				const loginResult = await login(form.email, form.password);
				if (loginResult?.loggedIn) {
					toast.success("Login successful!");
					router.push("/");
				} else {
					toast.error(
						"Registration successful, but auto-login failed. Please login manually."
					);
					router.push("/login");
				}
			} catch (error) {
				toast.error(
					"Registration successful, but auto-login failed. Please login manually."
				);
				router.push("/login");
			}

			setForm(initialFormState);
		},
		onError: (error: any) => {
			console.error("Registration error:", error);
			toast.error(error?.response?.data?.message || "Registration failed.");
		},
	});

	function handleRegister(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const newUser: RegisterUser = {
			first_name: form.firstName,
			last_name: form.lastName,
			email: form.email,
			password: form.password,
		}; // Fixed typo: RegsiterUser -> RegisterUser
		registerMutation.mutate(newUser); // Fixed typo: regiserMutation -> registerMutation
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h2 className="my-6">Register</h2>
			<form onSubmit={handleRegister} className="flex flex-col space-y-3">
				<input
					type="text"
					name="firstName"
					placeholder="First Name"
					className="border p-2 rounded"
					onChange={handleChange}
					value={form.firstName}
					required
				/>
				<input
					type="text"
					name="lastName"
					placeholder="Last Name"
					className="border p-2 rounded"
					onChange={handleChange}
					value={form.lastName}
					required
				/>

				<input
					type="email"
					name="email"
					placeholder="Email"
					className="border p-2 rounded"
					onChange={handleChange}
					value={form.email}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="border p-2 rounded"
					onChange={handleChange}
					value={form.password}
					required
					minLength={6}
				/>
				<input
					type="password"
					name="confirmPassword"
					placeholder="Confirm Password"
					className="border p-2 rounded"
					onChange={handleChange}
					value={form.confirmPassword}
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
					disabled={registerMutation.isPending}
				>
					{registerMutation.isPending ? "Registering..." : "Register"}
				</button>

				<p className="text-sm text-gray-500">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}

export default RegisterPage;
