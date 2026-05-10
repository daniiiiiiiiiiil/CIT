export interface Answer {
    id: number;
    text: string;
}

export interface Question {
    id: number;
    text: string;
    type: "single" | "multiple";
    competence: string;
    answers: Answer[];
}

export interface UserAnswer {
    questionId: number;
    selectedAnswers: number[];
}

export interface Category {
    id: number;
    name: string;
}

export interface SubmitResponse {
    resultId: number;
}

export interface FloatingCodeLine {
    text: string;
    delay: number;
    x: number;
    duration: number;
}

export interface TerminalLine {
    text: string;
    color: string;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    delay: number;
    dur: number;
}