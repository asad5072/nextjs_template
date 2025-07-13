"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthInitializer() {
	const { jwtLogin } = useAuth();

	useEffect(() => {
		jwtLogin();
	}, [jwtLogin]);

	return null;
}
