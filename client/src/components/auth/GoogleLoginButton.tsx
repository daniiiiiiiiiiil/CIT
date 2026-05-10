import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
    onSuccess: (credential: string) => void;
    onError: () => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
        } else {
            onError();
        }
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={onError} />;
}