export interface Competence {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    competence_id: number;
    competence_name: string;
    questions_count: number;
}

export interface AnswerForm {
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    text: string;
    type: "single" | "multiple";
    category_id: number;
    answers_count: number;
}

export interface QuestionDetails extends Question {
    answers: { text: string; is_correct: boolean }[];
}

export interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalTests: number;
    avgPercent: number;
    failedCount: number;
}

export interface User {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
    created_at: string;
}

export interface Certificate {
    id: number;
    cert_number: string;
    user_name: string;
    user_email: string;
    category_name: string;
    competence_name: string | null;
    score: number;
    issued_at: string;
}

export interface CertificateStats {
    total: { total: number; unique_users: number };
    daily: Array<{ issued_date: string; issued_count: number }>;
    byCompetence: Array<{ competence_name: string; certificates_count: number; avg_score: number }>;
}

export interface QuestionFormType {
    id: string;
    editQ: Question | null;
    qText: string;
    qType: "single" | "multiple";
    answers: AnswerForm[];
}

export interface CategoryFormData {
    name: string;
    description: string;
    competenceId: number | null;
}

export interface QuestionFormData {
    text: string;
    type: "single" | "multiple";
    categoryId: number;
    answers: AnswerForm[];
}