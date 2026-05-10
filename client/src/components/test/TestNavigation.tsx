interface TestNavigationProps {
    currentIndex: number;
    total: number;
    isLast: boolean;
    submitting: boolean;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    answeredStatus: boolean[];
}

export function TestNavigation({
                                   currentIndex,
                                   total,
                                   isLast,
                                   submitting,
                                   onPrev,
                                   onNext,
                                   onSubmit,
                                   answeredStatus
                               }: TestNavigationProps) {
    return (
        <footer className="test-footer">
            <button
                className="test-btn test-btn--prev"
                onClick={onPrev}
                disabled={currentIndex === 0}
                aria-label="Previous question"
            >
                <span className="test-btn__arrow">‹</span>
                <span>Prev</span>
            </button>

            <div className="test-dots" aria-hidden="true">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`test-dot ${i === currentIndex ? "active" : ""} ${answeredStatus[i] ? "done" : ""}`}
                    />
                ))}
            </div>

            {isLast ? (
                <button className="test-btn test-btn--next test-btn--submit" onClick={onSubmit} disabled={submitting}>
                    <span>{submitting ? "Submitting..." : "Submit"}</span>
                    <span className="test-btn__arrow">⚡</span>
                </button>
            ) : (
                <button className="test-btn test-btn--next" onClick={onNext}>
                    <span>Next</span>
                    <span className="test-btn__arrow">›</span>
                </button>
            )}
        </footer>
    );
}