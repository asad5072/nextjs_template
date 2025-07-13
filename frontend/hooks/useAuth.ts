"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { useCallback } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

interface User {
	id: string;
	email: string;
	username?: string;
	user_type?: string;
	is_superuser?: boolean;
}

interface AuthResponse {
	access: string;
	refresh?: string;
	user: User;
}

interface AuthState {
	user: User | null;
	setUser: (user: User | null) => void;
	notifs: any[];
	setNotifs: (notifs: any[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	notifs: [],
	setNotifs: (notifs) => set({ notifs }),
}));

export function useAuth() {
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);
	const notifs = useAuthStore((state) => state.notifs);
	const setNotifs = useAuthStore((state) => state.setNotifs);

	const isAuthenticated = !!user;

	const jwtLogin = useCallback(async () => {
		const token = Cookies.get("jwt-token");
		if (!token) {
			setUser(null);
			return false;
		}

		try {
			const res = await axios.get(`${baseURL}/auth/validate-token/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (res.data) {
				setUser(res.data.user || res.data);
				Cookies.set("jwt-token", res.data.access || token);
				if (res.data.user?.username) {
					Cookies.set("username", res.data.user.username);
				}
				return true;
			}
		} catch (err: any) {
			console.error("JWT validation error:", err);
			Cookies.remove("jwt-token");
			Cookies.remove("username");
			setUser(null);
			return false;
		}
	}, [setUser]);

	const login = async (email: string, password: string) => {
		try {
			const res = await axios.post<AuthResponse>(
				`${baseURL}/auth/login/`,
				{ email, password },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (res.data) {
				setUser(res.data.user);
				Cookies.set("jwt-token", res.data.access);
				if (res.data.user?.username) {
					Cookies.set("username", res.data.user.username);
				}

				return {
					loggedIn: true,
					user_type: res.data.user.user_type,
					is_superuser: res.data.user.is_superuser,
				};
			}
		} catch (err: any) {
			console.error("Login error:", err);
			return {
				loggedIn: false,
				error: err.response?.data?.message || "Login failed",
			};
		}
	};

	const logout = () => {
		setUser(null);
		Cookies.remove("jwt-token");
		Cookies.remove("username");
		router.push("/");
	};

	return {
		user,
		isAuthenticated,
		jwtLogin,
		login,
		logout,
		notifs,
		setNotifs,
	};
}
