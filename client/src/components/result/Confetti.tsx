import { generateConfetti } from "../../constants/result.constants";

const CONFETTI_PIECES = generateConfetti();

export function Confetti() {
    return (
        <div className="res-confetti" aria-hidden>
            {CONFETTI_PIECES.map(p => (
                <div key={p.id} className="res-confetti__piece" style={{
                    left: `${p.x}%`,
                    width: p.size, height: p.size,
                    background: p.color,
                    transform: `rotate(${p.rot}deg)`,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                }} />
            ))}
        </div>
    );
}