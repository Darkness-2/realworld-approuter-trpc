/** @type {import("eslint").Linter.Config} */
const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module"
	},
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "next/core-web-vitals"],
	rules: {
		"@typescript-eslint/consistent-type-imports": "error"
	}
};

module.exports = config;
