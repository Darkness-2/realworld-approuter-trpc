import { auth } from "$/lib/server/auth/lucia";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Todo: Replace this with tRPC procedure
export const POST = async (req: NextRequest) => {
	const formData = await req.formData();
	const username = formData.get("username");
	const password = formData.get("password");

	// Todo: Replace with better zod validator
	if (typeof username !== "string" || username.length < 1 || username.length > 31) {
		return NextResponse.json({ error: "Invalid username" }, { status: 400 });
	}

	if (typeof password !== "string" || password.length < 1 || password.length > 255) {
		return NextResponse.json({ error: "Invalid password" }, { status: 400 });
	}

	try {
		// Find user by key and validate the password
		const key = await auth.useKey("username", username.toLowerCase(), password);
		const session = await auth.createSession({
			userId: key.userId,
			attributes: {}
		});

		const authRequest = auth.handleRequest(req.method, context);
		authRequest.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	} catch (e) {
		// Todo: Handle errors better
		return NextResponse.json({ error: "An unknown error occured" }, { status: 500 });
	}
};
