import { useState, useEffect } from "react";

interface AnimatedNumberProps {
    value: number;
    suffix?: string;
    duration?: number;
}

export function AnimatedNumber({ value, suffix = "", duration = 1200 }: AnimatedNumberProps) {
    const [displayed, setDisplayed] = useState(0);

    useEffect(() => {
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(ease * value));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value, duration]);

    return <>{displayed}{suffix}</>;
}