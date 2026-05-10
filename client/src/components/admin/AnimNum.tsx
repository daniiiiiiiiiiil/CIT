import { useEffect, useState } from "react";

interface AnimNumProps {
    value: number;
    suffix?: string;
}

export function AnimNum({ value, suffix = "" }: AnimNumProps) {
    const [d, setD] = useState(0);

    useEffect(() => {
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1000, 1);
            setD(Math.round((1 - Math.pow(1 - p, 3)) * value));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value]);

    return <>{d}{suffix}</>;
}