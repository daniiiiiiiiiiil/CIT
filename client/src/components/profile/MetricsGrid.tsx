import { AnimatedNumber } from "./AnimatedNumber";
import type { Metric } from "../../types/profile.types";

interface MetricsGridProps {
    metrics: Metric[];
    totalTests: number;
}

export function MetricsGrid({ metrics, totalTests }: MetricsGridProps) {
    return (
        <div className="pf-metrics">
            {metrics.map((m, i) => (
                <div key={i} className="pf-metric" style={{ "--m-color": m.color } as React.CSSProperties}>
                    <div className="pf-metric__icon">{m.icon}</div>
                    <div className="pf-metric__val">
                        <AnimatedNumber value={m.val} suffix={m.suffix} />
                    </div>
                    <div className="pf-metric__label">{m.label}</div>
                    <div className="pf-metric__bar">
                        <div
                            className="pf-metric__bar-fill"
                            style={{ width: `${m.suffix === "%" ? m.val : Math.min((m.val / Math.max(totalTests, 1)) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}