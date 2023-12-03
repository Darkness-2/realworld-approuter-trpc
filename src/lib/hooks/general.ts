import { useEffect, useState } from "react";

/**
 * Simple hook that returns a boolean of whether you are on client or not.
 */
export const useIsClient = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
};
