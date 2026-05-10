import { useState, useEffect } from "react";

interface CircularScoreProps {
    percent: number;
    passed: boolean;
}

export function CircularScore({ percent, passed }: CircularScoreProps) {
    const [displayed, setDisplayed] = useState(0);
    const [strokeDash, setStrokeDash] = useState(0);
    const radius = 90;
    const circ = 2 * Math.PI * radius;

    useEffect(() => {
        let start: number | null = null;
        const duration = 1800;

        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(ease * percent));
            setStrokeDash(ease * (percent / 100) * circ);
            if (progress < 1) requestAnimationFrame(step);
        };

        const timer = setTimeout(() => requestAnimationFrame(step), 400);
        return () => clearTimeout(timer);
    }, [percent, circ]);

    const color = passed
        ? "url(#scoreGradientPass)"
        : "url(#scoreGradientFail)";

    return (
        <div className="res-circle-wrap">
            <svg className="res-circle-svg" viewBox="0 0 220 220">
                <defs>
                    <linearGradient id="scoreGradientPass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                    <linearGradient id="scoreGradientFail" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff4757" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="scoreGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="110" cy="110" r={radius}
                        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                {Array.from({ length: 40 }).map((_, i) => {
                    const angle = (i / 40) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const inner = 96, outer = 102;
                    return (
                        <line key={i}
                              x1={110 + inner * Math.cos(rad)} y1={110 + inner * Math.sin(rad)}
                              x2={110 + outer * Math.cos(rad)} y2={110 + outer * Math.sin(rad)}
                              stroke="rgba(0,212,255,0.15)" strokeWidth="1"
                        />
                    );
                })}
                <circle cx="110" cy="110" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash} ${circ}`}
                        strokeDashoffset={0}
                        transform="rotate(-90 110 110)"
                        filter="url(#scoreGlow)"
                        style={{ transition: "stroke-dasharray 0.05s linear" }}
                />
                {strokeDash > 0 && (() => {
                    const angle = (strokeDash / circ) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const cx = 110 + radius * Math.cos(rad);
                    const cy = 110 + radius * Math.sin(rad);
                    return (
                        <circle cx={cx} cy={cy} r="6"
                                fill={passed ? "#00ff88" : "#ff4757"}
                                filter="url(#scoreGlow)"
                        />
                    );
                })()}
                <text x="110" y="100" textAnchor="middle"
                      fill={passed ? "#00ff88" : "#ff4757"}
                      fontSize="52" fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace">
                    {displayed}
                </text>
                <text x="110" y="124" textAnchor="middle"
                      fill="rgba(255,255,255,0.4)"
                      fontSize="14" fontFamily="'JetBrains Mono', monospace">
                    %
                </text>
                <text x="110" y="148" textAnchor="middle"
                      fill={passed ? "rgba(0,255,136,0.7)" : "rgba(255,71,87,0.7)"}
                      fontSize="11" fontFamily="'JetBrains Mono', monospace"
                      letterSpacing="3">
                    {passed ? "ПРОЙДЕНО" : "НЕ ПРОЙДЕНО"}
                </text>
            </svg>
        </div>
    );
}