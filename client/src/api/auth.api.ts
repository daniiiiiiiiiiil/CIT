import axios from "axios";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth.types";

const API = import.meta.env.VITE_API_URL;

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const res = await axios.post<AuthResponse>(`${API}/api/login`, credentials);
        return res.data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const res = await axios.post<AuthResponse>(`${API}/api/register`, credentials);
        return res.data;
    },

    async googleLogin(token: string): Promise<AuthResponse> {
        const res = await axios.post<AuthResponse>(`${API}/auth/google`, { token });
        return res.data;
    },

    saveToken(token: string): void {
        localStorage.setItem("token", token);
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    removeToken(): void {
        localStorage.removeItem("token");
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem("token");
    }
};