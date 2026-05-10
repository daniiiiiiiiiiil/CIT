import { useState, useEffect } from "react";
import { TERMINAL_LINES } from "../../constants/test.constants";

export function Terminal() {
    const [visibleLines, setVisibleLines] = useState(1);

    useEffect(() => {
        if (visibleLines >= TERMINAL_LINES.length) return;
        const t = setTimeout(() => setVisibleLines(v => v + 1), 420);
        return () => clearTimeout(t);
    }, [visibleLines]);

    return (
        <div className="side-terminal" aria-hidden="true">
            <div className="side-terminal__header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="side-terminal__title">bash — 80×24</span>
            </div>
            <div className="side-terminal__body">
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className="side-terminal__line" style={{ color: line.color }}>
                        {line.text}
                    </div>
                ))}
            </div>
        </div>
    );
}