import { getPageSession } from "$/server/auth/lucia";
import { type Session } from "lucia";
import { redirect } from "next/navigation";
import { type ComponentType } from "react";

// Todo: Consider doing this in middleware instead?
// Todo: Replace this with calls to tRPC server-side helper; add TRPCHydrate
// (doing that will mean the getCurrentUser call can be pre-fetched server-side and hydrated for instant loading)

export interface SessionProps {
	session: Session | null;
}

/**
 * Higher-order server component to wrap a component with the user's session or null.
 *
 * @see https://blog.logrocket.com/understanding-react-higher-order-components
 * @param Component to wrap
 * @returns Component with session prop added
 */
export const withSession = <Props,>(Component: ComponentType<Props & SessionProps>) => {
	const WrappedComponent = async (props: Props) => {
		const session = await getPageSession("GET");

		return <Component {...props} session={session} />;
	};

	WrappedComponent.displayName = `withSession(${Component.displayName})`;
	return WrappedComponent;
};

export interface SessionRequiredProps {
	session: Session;
}

/**
 * Higher-order server component to wrap a component with the user's session.
 * Redirects the user to the provided URL if no session is found.
 *
 * @see https://blog.logrocket.com/understanding-react-higher-order-components
 * @param Component to wrap
 * @param redirectTo URL to redirect the user to if no session is found
 * @returns Component with session prop added
 */
export const withRequireSession = <Props,>(
	Component: ComponentType<Props & SessionRequiredProps>,
	redirectTo: string
) => {
	const WrappedComponent = async (props: Props) => {
		const session = await getPageSession("GET");
		if (!session) redirect(redirectTo);

		return <Component {...props} session={session} />;
	};

	WrappedComponent.displayName = `withRequireSession(${Component.displayName})`;
	return WrappedComponent;
};

/**
 * Higher-order server component to wrap a component.
 * Redirects the user to the provided URL if a session is found.
 *
 * @see https://blog.logrocket.com/understanding-react-higher-order-components
 * @param Component to wrap
 * @param redirectTo URL to redirect the user to if a session is found
 * @returns Component
 */
export const withRequireNoSession = <Props extends Record<string, never>>(
	Component: ComponentType<Props>,
	redirectTo: string
) => {
	const WrappedComponent = async (props: Props) => {
		const session = await getPageSession("GET");
		if (session) redirect(redirectTo);

		return <Component {...props} />;
	};

	WrappedComponent.displayName = `withRequireLoggedOut(${Component.displayName})`;
	return WrappedComponent;
};
