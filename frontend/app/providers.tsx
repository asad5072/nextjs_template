"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import AuthInitializer from "./components/AuthInitializer";

export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<AuthInitializer />
			{children}
		</QueryClientProvider>
	);
}
