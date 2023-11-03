/* Below eslint-disable required; lucia Auth doesn't work as a module import. */
/* eslint-disable @typescript-eslint/consistent-type-imports */

import "@total-typescript/ts-reset";

/// <reference types="lucia" />
declare namespace Lucia {
	export type Auth = import("$/server/auth/lucia").Auth;
	export type DatabaseUserAttributes = {
		username: string;
	};
	export type DatabaseSessionAttributes = Record<string, never>;
}
