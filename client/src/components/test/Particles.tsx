import { generateParticles } from "../../constants/test.constants";

const PARTICLES = generateParticles();

export function Particles() {
    return (
        <div className="particles" aria-hidden="true">
            {PARTICLES.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        "--x": `${p.x}%`,
                        "--y": `${p.y}%`,
                        "--delay": `${p.delay}s`,
                        "--dur": `${p.dur}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}