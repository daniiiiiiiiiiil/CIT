import type { Question } from "../../types/test.types";

interface TestQuestionProps {
    question: Question;
    index: number;
}

export function TestQuestion({ question, index }: TestQuestionProps) {
    const points = question.type === "multiple" ? 2 : 1;
    const pointsText = points === 2 ? "2 балла" : "1 балл";

    return (
        <div className="test-question">
            <div className="test-question__number">Вопрос {index + 1}</div>
            <div className="test-question__text">{question.text}</div>
            <div className="test-question__sub">
                {question.type === "multiple" 
                    ? "Выберите все подходящие варианты" 
                    : "Выберите один вариант ответа"}
            </div>
            {/* Блок с отображением баллов */}
            <div className="test-question__points">
                <span className="test-question__points-icon">⭐</span>
                <span className="test-question__points-value">{pointsText}</span>
                <span className="test-question__points-hint">
                    {points === 2 
                        ? "(за полный правильный ответ)" 
                        : "(за правильный ответ)"}
                </span>
            </div>
        </div>
    );
}