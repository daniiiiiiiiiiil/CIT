import axios from "axios";
import type { Category, User } from "../types/categories.types";

const API = window.location.hostname === "localhost" ? "http://localhost:5000" : "http://85.239.49.128:5000";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const categoriesApi = {
    async getMe(): Promise<User> {
        const res = await axios.get<User>(`${API}/api/me`, { headers: getHeaders() });
        return res.data;
    },

    async getCategories(): Promise<Category[]> {
        const res = await axios.get<Category[]>(`${API}/api/categories`, { headers: getHeaders() });
        return res.data;
    },

    async logout(): Promise<void> {
        await axios.post(`${API}/api/logout`, {}, { headers: getHeaders() });
    }
};