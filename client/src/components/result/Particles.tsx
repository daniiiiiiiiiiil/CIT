import { generateParticles } from "../../constants/result.constants";

const PARTICLES = generateParticles();

interface ParticlesProps {
    active: boolean;
}

export function Particles({ active }: ParticlesProps) {
    if (!active) return null;
    return (
        <div className="res-particles" aria-hidden>
            {PARTICLES.map(p => (
                <div key={p.id} className="res-particle" style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: p.size, height: p.size,
                    background: p.color,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                }} />
            ))}
        </div>
    );
}