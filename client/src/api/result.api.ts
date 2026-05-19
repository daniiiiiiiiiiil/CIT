import axios from "axios";
import type { TestResult } from "../types/result.types";

const API = window.location.hostname === "localhost" ? "http://localhost:5000" : "http://85.239.49.128:5000";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const resultApi = {
    async getUserInfo(): Promise<{ name: string }> {
        const res = await axios.get<{ name: string }>(`${API}/api/me`, { headers: getHeaders() });
        return res.data;
    },

    async getTestResult(resultId: number): Promise<TestResult> {
        const res = await axios.get<TestResult>(`${API}/api/test/result/${resultId}`, { headers: getHeaders() });
        return res.data;
    }
};