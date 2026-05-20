import axios from "axios";
import type {
    Competence, Category, Question, QuestionDetails, Stats,
    User, Certificate, CertificateStats, CategoryFormData, QuestionFormData
} from "../types/admin.types";

const API = window.location.hostname === "localhost" ? "http://localhost:5000" : "http://5.42.121.83:5000";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const adminApi = {
    async getStats(): Promise<Stats> {
        const res = await axios.get<Stats>(`${API}/api/admin/stats`, { headers: getHeaders() });
        return res.data;
    },

    async getUsers(): Promise<User[]> {
        const res = await axios.get<User[]>(`${API}/api/admin/users`, { headers: getHeaders() });
        return res.data;
    },

    async toggleAdmin(userId: number): Promise<{ message: string }> {
        const res = await axios.put(`${API}/api/admin/users/${userId}/toggle-admin`, {}, { headers: getHeaders() });
        return res.data;
    },

    async deleteUser(userId: number): Promise<void> {
        await axios.delete(`${API}/api/admin/users/${userId}`, { headers: getHeaders() });
    },

    async getCategories(): Promise<Category[]> {
        const res = await axios.get<Category[]>(`${API}/api/admin/categories`, { headers: getHeaders() });
        return res.data;
    },

    async createCategory(data: CategoryFormData): Promise<Category> {
        const res = await axios.post<Category>(`${API}/api/admin/categories`, data, { headers: getHeaders() });
        return res.data;
    },

    async updateCategory(id: number, data: CategoryFormData): Promise<Category> {
        const res = await axios.put<Category>(`${API}/api/admin/categories/${id}`, data, { headers: getHeaders() });
        return res.data;
    },

    async deleteCategory(id: number): Promise<void> {
        await axios.delete(`${API}/api/admin/categories/${id}`, { headers: getHeaders() });
    },

    async getQuestions(): Promise<Question[]> {
        const res = await axios.get<Question[]>(`${API}/api/admin/questions`, { headers: getHeaders() });
        return res.data;
    },

    async getQuestionDetails(id: number): Promise<QuestionDetails> {
        const res = await axios.get<QuestionDetails>(`${API}/api/admin/questions/${id}/details`, { headers: getHeaders() });
        return res.data;
    },

    async createQuestion(data: QuestionFormData): Promise<Question> {
        const res = await axios.post<Question>(`${API}/api/admin/questions`, data, { headers: getHeaders() });
        return res.data;
    },

    async updateQuestion(id: number, data: QuestionFormData): Promise<Question> {
        const res = await axios.put<Question>(`${API}/api/admin/questions/${id}`, data, { headers: getHeaders() });
        return res.data;
    },

    async deleteQuestion(id: number): Promise<void> {
        await axios.delete(`${API}/api/admin/questions/${id}`, { headers: getHeaders() });
    },

    async getCompetences(): Promise<Competence[]> {
        const res = await axios.get<Competence[]>(`${API}/api/competences`, { headers: getHeaders() });
        return res.data;
    },

    async createCompetence(name: string): Promise<Competence> {
        const res = await axios.post<Competence>(`${API}/api/admin/competences`, { name }, { headers: getHeaders() });
        return res.data;
    },

    async deleteCompetence(id: number): Promise<void> {
        await axios.delete(`${API}/api/admin/competences/${id}`, { headers: getHeaders() });
    },

    async getCertificates(params?: { category?: string; dateFrom?: string; dateTo?: string }): Promise<Certificate[]> {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append("category", params.category);
        if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
        if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
        const url = `${API}/api/admin/certificates${queryParams.toString() ? `?${queryParams}` : ""}`;
        const res = await axios.get<Certificate[]>(url, { headers: getHeaders() });
        return res.data;
    },

    async getCertificateStats(): Promise<CertificateStats> {
        const res = await axios.get<CertificateStats>(`${API}/api/admin/certificates/stats`, { headers: getHeaders() });
        return res.data;
    },

    async logout(): Promise<void> {
        await axios.post(`${API}/api/logout`, {}, { headers: getHeaders() });
    }
};