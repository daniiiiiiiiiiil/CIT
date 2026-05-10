import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.tsx'

const GOOGLE_CLIENT_ID = "92502032506-d20dn07uie9cimsv4asnv06mcm355gga.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
)