export interface CompetenceResult {
    name: string;
    correct: number;
    total: number;
    percent: number;
}

export interface TestResult {
    resultId: number;
    totalCorrect: number;    
    totalQuestions: number;  
    percent: number;
    passed: boolean;
    certificateNumber: string | null;
    competences: CompetenceResult[];
    finishedAt: string;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    dur: number;
    delay: number;
    color: string;
}

export interface ConfettiPiece {
    id: number;
    x: number;
    rot: number;
    size: number;
    dur: number;
    delay: number;
    color: string;
}