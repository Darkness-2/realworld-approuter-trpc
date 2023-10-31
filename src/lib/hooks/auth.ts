import Cookies from "js-cookie";

export const useUser = () => {
	const userCookie = Cookies.get("user");

	// If no cookie, user is not logged in
	if (!userCookie) {
		return null;
	}

	// Todo: Validate through Zod
	return JSON.parse(userCookie) as { username: string; userId: string };
};
