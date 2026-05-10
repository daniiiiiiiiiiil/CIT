import type { Answer } from "../../types/test.types";

interface TestAnswersProps {
    answers: Answer[];
    questionType: "single" | "multiple";
    selectedAnswers: number[];
    onAnswer: (answerId: number) => void;
}

export function TestAnswers({ answers, questionType, selectedAnswers, onAnswer }: TestAnswersProps) {
    const getLetter = (i: number) => String.fromCharCode(65 + i);
    const isAnswered = (id: number) => selectedAnswers.includes(id);

    return (
        <div className="test-answers">
            {answers.map((answer, idx) => (
                <label
                    key={answer.id}
                    className={`test-answer ${isAnswered(answer.id) ? "selected" : ""}`}
                >
                    <input
                        type={questionType === "single" ? "radio" : "checkbox"}
                        name="answer"
                        checked={isAnswered(answer.id)}
                        onChange={() => onAnswer(answer.id)}
                    />
                    <div className="test-answer__letter">{getLetter(idx)}</div>
                    <div className="test-answer__text">{answer.text}</div>
                    <div className="test-answer__check" aria-hidden="true">✓</div>
                </label>
            ))}
        </div>
    );
}