"use client";

import type { RouterOutputs } from "$/lib/server/trpc/root";
import { trpc } from "$/lib/trpc/client";
import { useState } from "react";

type Props = {
	initialTodos: RouterOutputs["getTodos"];
};

export default function TodoList({ initialTodos }: Props) {
	const getTodos = trpc.getTodos.useQuery(undefined, { initialData: initialTodos, refetchOnMount: false });
	const addTodo = trpc.addTodo.useMutation({
		onSettled: () => {
			getTodos.refetch();
		}
	});

	const [content, setContent] = useState("");

	const handleAddTodo = async () => {
		if (content.length) {
			addTodo.mutate(content);
			setContent("");
		}
	};

	return (
		<>
			<ul>{getTodos.data?.map((todo) => <li key={todo.id}>{todo.content}</li>)}</ul>
			<div>
				<label htmlFor="content">Content:</label>
				<input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} />
				<button onClick={handleAddTodo}>Add todo</button>
			</div>
		</>
	);
}
