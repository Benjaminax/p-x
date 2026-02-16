/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                accent: '#000000',
            },
            backdropBlur: {
                xs: '4px',
                sm: '8px',
                md: '16px',
            }
        },
    },
    plugins: [],
}
