import { getPageSession } from "$/server/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
	const session = await getPageSession();
	if (!session) redirect("/");

	return (
		<div>
			<h1>Profile page</h1>
			<Link href="/">Home</Link>
			<div>You are: {session.user.username}</div>
		</div>
	);
}
