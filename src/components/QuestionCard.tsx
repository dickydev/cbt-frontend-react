import type { ExamQuestion } from "../types/exam";

interface QuestionCardProps {
  question: ExamQuestion;
  onChoose: (questionId: string, optionId: string) => void;
}

export default function QuestionCard({
  question,
  onChoose,
}: QuestionCardProps) {
  return (
    <section className="question-card">
      <div className="question-number">Soal {question.display_order}</div>
      <h2>{question.question_text}</h2>

      <div className="option-list">
        {question.options.map((option) => {
          const selected = question.selected_option_id === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`option-btn ${selected ? "selected" : ""}`}
              onClick={() => onChoose(question.id, option.id)}
            >
              <span className="option-key">{option.option_key}</span>
              <span>{option.option_text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
