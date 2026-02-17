/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ayur-primary': '#6B7A1E',
                'ayur-primary-dark': '#2F4F2F',
                'ayur-accent': '#C46A2B',
                'ayur-cream': '#F4F1E8',
                'ayur-sage': '#DCE6C2',
                'ayur-charcoal': '#1E1E1E',
                'ayur-white': '#F7F7F7',
            }
        },
    },
    plugins: [],
}
