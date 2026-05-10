export function LoadingSpinner() {
    return (
        <div className="cat-loading">
            <div className="cat-loading__ring" />
            <div className="cat-loading__text">
                <span>Загрузка</span>
                <span className="cat-loading__dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>
        </div>
    );
}