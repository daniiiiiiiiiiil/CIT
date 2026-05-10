export interface Category {
    id: number;
    name: string;
    description: string;
    questions_count: number;
    created_at: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
}

export interface CategoryColor {
    bg: string;
    border: string;
    glow: string;
}

export interface Cube {
    size: number;
    x: number;
    y: number;
    dur: number;
    delay: number;
    rotX: number;
    rotY: number;
    color: string;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    delay: number;
    size: number;
    duration: number;
}