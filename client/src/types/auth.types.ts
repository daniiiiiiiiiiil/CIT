export interface User {
    id: number;
    email: string;
    name: string;
    isAdmin?: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    name?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface VerifyTokenResponse {
    valid: boolean;
    email: string;
}