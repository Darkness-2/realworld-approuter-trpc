import Hello from "$/components/Hello";
import TodoList from "$/components/TodoList";
import { getServerClient } from "$/lib/trpc/serverClient";

export default async function Home() {
	const todos = await getServerClient().getTodos();
	const hello = await getServerClient().hello();

	return (
		<main>
			<div>From page: {hello}</div>
			<div>
				From other component: <Hello />
			</div>
			<TodoList initialTodos={todos} />
		</main>
	);
}

export const dynamic = "force-dynamic";
