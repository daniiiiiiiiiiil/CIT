import type { Question } from "../../types/test.types";

interface TestQuestionProps {
    question: Question;
    index: number;
}

export function TestQuestion({ question, index }: TestQuestionProps) {
    return (
        <div className="test-question">
            <div className="test-question__number">Question {index + 1}</div>
            <div className="test-question__text">{question.text}</div>
            <div className="test-question__sub">
                {question.type === "multiple" ? "Select all that apply" : "Choose one answer"}
            </div>
        </div>
    );
}