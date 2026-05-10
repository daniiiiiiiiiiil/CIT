import type { Cube } from "../../types/categories.types";

interface FloatingCubeProps extends Cube {}

export function FloatingCube({ size, x, y, dur, delay, rotX, rotY, color }: FloatingCubeProps) {
    const half = size / 2;
    const face = (transform: string): React.CSSProperties => ({
        position: "absolute",
        width: size,
        height: size,
        border: `1px solid ${color}`,
        background: `${color}09`,
        boxSizing: "border-box",
        transform,
    });

    return (
        <div
            className="cat-cube"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                "--cube-dur": `${dur}s`,
                "--cube-delay": `${delay}s`,
                "--cube-rot-x": `${rotX}deg`,
                "--cube-rot-y": `${rotY}deg`,
                "--cube-color": color,
                "--cube-half": `${half}px`,
            } as React.CSSProperties}
        >
            <div className="cat-cube__inner">
                <div style={face(`translateZ(${half}px)`)} />
                <div style={face(`rotateY(180deg) translateZ(${half}px)`)} />
                <div style={face(`rotateY(-90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateY(90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateX(90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateX(-90deg) translateZ(${half}px)`)} />
            </div>
        </div>
    );
}