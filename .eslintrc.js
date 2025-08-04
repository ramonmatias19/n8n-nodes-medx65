module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
	],
	env: {
		node: true,
		es6: true,
	},
	rules: {
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
	},
}; 