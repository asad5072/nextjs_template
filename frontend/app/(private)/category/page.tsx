import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { type Category } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function Home() {
	const { post } = useApi();
	const [category, setCategory] = useState("");
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (newCategory: Category) => post("/categories", newCategory),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			setCategory(""); // Clear the input field after successful submission
		},
	});
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutation.mutate({ name: category });
	};
	return (
		<div>
			<h1>Categories</h1>
			<p>Add Categories</p>
			<div>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						name="name"
						placeholder="Category Name"
						required
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					/>
					<button type="submit">Add Category</button>
				</form>
			</div>
		</div>
	);
}
