/** @type {import('tailwindcss').Config} */

const colors = require("./src/constants/colors");

module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			// Spread directo — Tailwind genera automáticamente todas las clases
			// bg-brand-primario-v1, text-info-danger-v2, etc.
			colors,
			fontFamily: {
				sans: ["Inter"],
				"sans-italic": ["Inter-Italic"],
				"sans-bold": ["Inter-Bold"],
				mono: ["RedHatMono_400Regular"],
				"mono-italic": ["RedHatMono_400Regular"],
				"mono-bold": ["RedHatMono_700Bold"],
			},
		},
	},
	plugins: [],
};
