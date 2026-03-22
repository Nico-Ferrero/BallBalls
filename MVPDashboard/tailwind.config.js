/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#10B981",
                    hover: "#059669",
                    light: "#ECFDF5",
                },
                gray: {
                    50: "#F7F7F7",
                    100: "#EBEBEB",
                    200: "#DDDDDD",
                    300: "#C0C0C0",
                    400: "#B0B0B0",
                    500: "#717171",
                    600: "#5E5E5E",
                    700: "#484848",
                    800: "#222222",
                    900: "#1A1A1A",
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 6px 16px rgba(0,0,0,0.12)',
                'card': '0 6px 20px rgba(0,0,0,0.08)',
            }
        },
    },
    plugins: [],
}
