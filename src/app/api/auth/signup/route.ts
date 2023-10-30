import { auth } from "$/server/auth/lucia";
import * as context from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Todo: Replace this with tRPC procedure
export const POST = async (req: NextRequest) => {
	const formData = await req.formData();
	const username = formData.get("username");
	const password = formData.get("password");

	// Todo: Replace with better zod validator
	if (typeof username !== "string" || username.length < 4 || username.length > 31) {
		return NextResponse.json({ error: "Invalid username" }, { status: 400 });
	}

	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return NextResponse.json({ error: "Invalid password" }, { status: 400 });
	}

	try {
		const user = await auth.createUser({
			key: {
				providerId: "username",
				providerUserId: username.toLowerCase(),
				password
			},
			attributes: {
				username
			}
		});

		const session = await auth.createSession({
			userId: user.userId,
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
		// Todo: Catch unique constraint on database
		return NextResponse.json({ error: "An unknown error occured" }, { status: 500 });
	}
};
