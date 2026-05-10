import { CODE_ROWS } from "../../constants/test.constants";

interface BigLaptopProps {
    pulse: boolean;
}

export function BigLaptop({ pulse }: BigLaptopProps) {
    return (
        <div className={`big-laptop ${pulse ? "pulse" : ""}`} aria-hidden="true">
            <div className="big-laptop__lid">
                <div className="big-laptop__screen-header">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                    <span className="big-laptop__screen-title">main.tsx</span>
                </div>
                <div className="big-laptop__screen-body">
                    {CODE_ROWS.map((row, i) => (
                        <div key={i} className="big-laptop__code-row" style={{ animationDelay: `${i * 0.12}s` }}>
                            <span className="big-laptop__ln">{row.ln}</span>
                            <span className="big-laptop__code" style={{ color: row.c }}>{row.code}</span>
                        </div>
                    ))}
                    <div className="big-laptop__caret">▋</div>
                </div>
            </div>
            <div className="big-laptop__hinge" />
            <div className="big-laptop__base">
                <div className="big-laptop__keyboard">
                    {Array.from({ length: 42 }).map((_, i) => (
                        <div key={i} className="big-laptop__key" style={{ "--ki": i } as React.CSSProperties} />
                    ))}
                </div>
                <div className="big-laptop__trackpad" />
            </div>
        </div>
    );
}