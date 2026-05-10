import { FLOATING_CODE_LINES } from "../../constants/test.constants";

export function FloatingCode() {
    return (
        <div className="floating-code" aria-hidden="true">
            {FLOATING_CODE_LINES.map((line, i) => (
                <span
                    key={i}
                    className="floating-code__line"
                    style={{
                        "--delay": `${line.delay}s`,
                        "--x": `${line.x}%`,
                        "--dur": `${line.duration}s`,
                    } as React.CSSProperties}
                >
                    {line.text}
                </span>
            ))}
        </div>
    );
}