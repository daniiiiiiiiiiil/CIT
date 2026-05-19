interface TestProgressProps {
    currentIndex: number;
    total: number;
    answersCount: number;
    categoryName: string;
    maxScore?: number;
}

export function TestProgress({ currentIndex, total, answersCount, categoryName, maxScore }: TestProgressProps) {
    const progress = ((currentIndex + 1) / total) * 100;

    return (
        <>
            <div className="test-topbar">
                <div className="test-topbar__badge">{categoryName}</div>
                <div className="test-counter">
                    <span className="test-counter__cur">{currentIndex + 1}</span>
                    <span className="test-counter__sep">/</span>
                    <span className="test-counter__total">{total}</span>
                </div>
                {maxScore !== undefined && (
                    <div className="test-topbar__max-score">
                        Max: {maxScore} баллов
                    </div>
                )}
                <div className="test-topbar__answered">{answersCount} отвечено</div>
            </div>

            <div className="test-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="test-progress__bar" style={{ width: `${progress}%` }}>
                    <div className="test-progress__glow" />
                </div>
            </div>
        </>
    );
}