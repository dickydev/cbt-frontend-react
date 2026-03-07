interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answeredMap: Record<string, boolean>;
  questionIds: string[];
  onSelect: (index: number) => void;
}

export default function QuestionPalette({
  total,
  currentIndex,
  answeredMap,
  questionIds,
  onSelect,
}: QuestionPaletteProps) {
  return (
    <aside className="palette" data-allow-scroll="true">
      <h3>Navigasi Soal</h3>
      <div className="palette-grid">
        {Array.from({ length: total }).map((_, index) => {
          const qid = questionIds[index];
          const answered = answeredMap[qid];
          const active = index === currentIndex;

          return (
            <button
              key={qid}
              type="button"
              className={`palette-btn ${active ? "active" : ""} ${answered ? "answered" : ""}`}
              onClick={() => onSelect(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
