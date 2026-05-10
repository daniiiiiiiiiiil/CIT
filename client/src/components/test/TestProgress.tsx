interface TestProgressProps {
    currentIndex: number;
    total: number;
    answersCount: number;
    categoryName: string;
}

export function TestProgress({ currentIndex, total, answersCount, categoryName }: TestProgressProps) {
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
                <div className="test-topbar__answered">{answersCount} answered</div>
            </div>

            <div className="test-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="test-progress__bar" style={{ width: `${progress}%` }}>
                    <div className="test-progress__glow" />
                </div>
            </div>
        </>
    );
}