import axios from "axios";
import type { UserProfile, TestResult } from "../types/profile.types";

const API = "http://5.42.121.83:5000";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const profileApi = {
    async getProfile(): Promise<UserProfile> {
        const res = await axios.get<UserProfile>(`${API}/api/me`, { headers: getHeaders() });
        return res.data;
    },

    async getResults(): Promise<TestResult[]> {
        const res = await axios.get<TestResult[]>(`${API}/api/user/results`, { headers: getHeaders() });
        return res.data;
    },

    async logout(): Promise<void> {
        await axios.post(`${API}/api/logout`, {}, { headers: getHeaders() });
    }
};