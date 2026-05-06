import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

if (!GOOGLE_CLIENT_ID) {
    console.error("Ошибка: VITE_GOOGLE_CLIENT_ID не задан в файле .env");
}

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
)