export interface UserProfile {
    id: number;
    email: string;
    name: string;
    picture?: string;
    isAdmin: boolean;
    created_at: string;
}

export interface TestResult {
    id: number;
    categoryName: string;
    percent: number;
    passed: boolean;
    finishedAt: string;
    certificateNumber: string | null;
}

export interface CategoryStats {
    name: string;
    avg: number;
    total: number;
    passed: number;
}

export interface Metric {
    val: number;
    label: string;
    suffix: string;
    color: string;
    icon: string;
}

export interface DayActivity {
    date: Date;
    best: number | null;
    count: number;
}