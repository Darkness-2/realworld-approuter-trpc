/* eslint-disable @typescript-eslint/consistent-type-imports */

/// <reference types="lucia" />
declare namespace Lucia {
	export type Auth = import("$/server/auth/lucia").Auth;
	export type DatabaseUserAttributes = {
		username: string;
	};
	export type DatabaseSessionAttributes = Record<string, never>;
}
