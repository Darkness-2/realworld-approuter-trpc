import LogoutButton from "$/components/LogoutButton";
import { getServerClient } from "$/lib/trpc/serverClient";
import Link from "next/link";

export default async function Home() {
	const hello = await getServerClient().hello();

	return (
		<main>
			<div>Greeting: {hello}</div>
			<ul>
				<li>
					{/* Todo - convert these to Chakra links */}
					<Link href="/auth/login">Login</Link>
				</li>
				<li>
					<Link href="/auth/signup">Sign up</Link>
				</li>
				<li>
					<Link href="/profile">Profile</Link>
				</li>
				<li>
					<LogoutButton />
				</li>
			</ul>
		</main>
	);
}
