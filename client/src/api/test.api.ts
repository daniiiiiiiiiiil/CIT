import axios from "axios";
import type { Question, Category, UserAnswer, SubmitResponse } from "../types/test.types";

const API = "http://5.42.121.83:5000";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const testApi = {
    async getQuestions(categoryId: number): Promise<Question[]> {
        const res = await axios.get<Question[]>(`${API}/api/categories/${categoryId}/questions`, {
            headers: getHeaders()
        });
        return res.data;
    },

    async getCategories(): Promise<Category[]> {
        const res = await axios.get<Category[]>(`${API}/api/categories`, {
            headers: getHeaders()
        });
        return res.data;
    },

    async submitTest(answers: UserAnswer[], categoryId: number): Promise<SubmitResponse> {
        const res = await axios.post<SubmitResponse>(
            `${API}/api/test/submit`,
            { answers, categoryId },
            { headers: getHeaders() }
        );
        return res.data;
    }
};