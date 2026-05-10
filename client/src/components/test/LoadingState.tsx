import { BigLaptop } from "./BigLaptop";

export function LoadingState() {
    return (
        <div className="test-loading">
            <BigLaptop pulse={true} />
            <p className="test-loading__text">
                Загрузка
                <span className="test-loading__dots" />
            </p>
        </div>
    );
}