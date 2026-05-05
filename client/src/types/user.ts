export interface User {
    id?: number;
    email: string;
    name: string;
    picture?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}