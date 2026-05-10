import { useState, useEffect } from "react";

interface RadialProgressProps {
    percent: number;
    size?: number;
    color?: string;
}

export function RadialProgress({ percent, size = 80, color = "#534AB7" }: RadialProgressProps) {
    const [dash, setDash] = useState(0);
    const r = size / 2 - 6;
    const circ = 2 * Math.PI * r;

    useEffect(() => {
        setTimeout(() => setDash((percent / 100) * circ), 200);
    }, [percent, circ]);

    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="5"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                style={{
                    transition: "stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)",
                    filter: `drop-shadow(0 0 6px ${color})`
                }}
            />
        </svg>
    );
}