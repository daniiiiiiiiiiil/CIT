import type { CategoryColor, Cube, Particle } from "../types/categories.types";

export const CATEGORY_COLORS: CategoryColor[] = [
    { bg: "linear-gradient(135deg, #00d4ff22, #0099ff11)", border: "#00d4ff", glow: "#00d4ff" },
    { bg: "linear-gradient(135deg, #00ff8822, #00cc6611)", border: "#00ff88", glow: "#00ff88" },
    { bg: "linear-gradient(135deg, #ff6b3522, #ff440011)", border: "#ff6b35", glow: "#ff6b35" },
    { bg: "linear-gradient(135deg, #a855f722, #7c3aed11)", border: "#a855f7", glow: "#a855f7" },
    { bg: "linear-gradient(135deg, #ffd70022, #ffaa0011)", border: "#ffd700", glow: "#ffd700" },
    { bg: "linear-gradient(135deg, #ff458b22, #e0196511)", border: "#ff458b", glow: "#ff458b" },
    { bg: "linear-gradient(135deg, #00e5ff22, #0097a711)", border: "#00e5ff", glow: "#00e5ff" },
    { bg: "linear-gradient(135deg, #76ff0322, #33691e11)", border: "#76ff03", glow: "#76ff03" },
];

export const ICONS: string[] = ["🚀", "📚", "🎨", "🎵", "💻", "📖", "🔬", "📜", "🎮", "🏆", "⚽", "🎭"];

export const CUBES: Cube[] = [
    { size: 60, x: 5, y: 10, dur: 18, delay: 0, rotX: 25, rotY: 45, color: "#00d4ff" },
    { size: 35, x: 88, y: 6, dur: 22, delay: -4, rotX: 60, rotY: 20, color: "#00ff88" },
    { size: 80, x: 92, y: 45, dur: 28, delay: -8, rotX: 15, rotY: 70, color: "#a855f7" },
    { size: 25, x: 3, y: 60, dur: 15, delay: -2, rotX: 45, rotY: 90, color: "#ff6b35" },
    { size: 50, x: 75, y: 80, dur: 20, delay: -10, rotX: 30, rotY: 55, color: "#ffd700" },
    { size: 40, x: 15, y: 85, dur: 25, delay: -6, rotX: 75, rotY: 30, color: "#00d4ff" },
    { size: 20, x: 50, y: 3, dur: 12, delay: -3, rotX: 50, rotY: 110, color: "#ff458b" },
    { size: 65, x: 60, y: 88, dur: 32, delay: -14, rotX: 20, rotY: 80, color: "#00ff88" },
    { size: 30, x: 35, y: 70, dur: 17, delay: -7, rotX: 80, rotY: 40, color: "#a855f7" },
    { size: 45, x: 82, y: 20, dur: 23, delay: -11, rotX: 35, rotY: 65, color: "#00e5ff" },
];

export const generateParticles = (): Particle[] => {
    return Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 4,
    }));
};