import type { Particle, ConfettiPiece } from "../types/result.types";

export const generateParticles = (): Particle[] => {
    return Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60 + 20,
        size: Math.random() * 4 + 2,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: ["#00d4ff", "#00ff88", "#a855f7", "#f59e0b"][Math.floor(Math.random() * 4)],
    }));
};

export const generateConfetti = (): ConfettiPiece[] => {
    return Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        rot: Math.random() * 360,
        size: Math.random() * 8 + 5,
        dur: Math.random() * 2 + 2,
        delay: Math.random() * 3,
        color: ["#00d4ff", "#00ff88", "#a855f7", "#f59e0b", "#ff6b9d"][Math.floor(Math.random() * 5)],
    }));
};