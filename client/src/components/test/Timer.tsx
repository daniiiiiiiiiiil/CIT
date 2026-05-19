// src/components/test/Timer.tsx
interface TimerProps {
    timeLeft: number;
    totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const percent = (timeLeft / totalTime) * 100;
    const isWarning = timeLeft < 60;

    return (
        <div className="test-timer">
            <div className={`test-timer__clock ${isWarning ? "warning" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{formatTime(timeLeft)}</span>
            </div>
            <div className="test-timer__bar">
                <div 
                    className="test-timer__bar-fill" 
                    style={{ 
                        width: `${percent}%`,
                        backgroundColor: isWarning ? "#ff4757" : "#00d4ff"
                    }} 
                />
            </div>
        </div>
    );
}