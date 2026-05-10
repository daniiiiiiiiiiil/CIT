import { useState, useRef, useEffect } from "react";
import type { CompetenceResult } from "../../types/result.types";

interface CompetenceBarProps {
    item: CompetenceResult;
    index: number;
}

export function CompetenceBar({ item, index }: CompetenceBarProps) {
    const [width, setWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => setWidth(item.percent), index * 120);
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [item.percent, index]);

    const color = item.percent >= 80 ? "#00ff88" : item.percent >= 60 ? "#f59e0b" : "#ff4757";
    const glowColor = item.percent >= 80
        ? "rgba(0,255,136,0.35)"
        : item.percent >= 60
            ? "rgba(245,158,11,0.35)"
            : "rgba(255,71,87,0.35)";

    return (
        <div className="res-comp-item" ref={ref}
             style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="res-comp-header">
                <span className="res-comp-name">{item.name}</span>
                <div className="res-comp-right">
                    <span className="res-comp-fraction">{item.correct}/{item.total}</span>
                    <span className="res-comp-pct" style={{ color }}>{item.percent}%</span>
                </div>
            </div>
            <div className="res-comp-track">
                <div
                    className="res-comp-fill"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        boxShadow: `0 0 12px ${glowColor}`,
                    }}
                />
                <div className="res-comp-mark" style={{ left: "80%" }} />
            </div>
        </div>
    );
}