interface ExamHeaderProps {
  title: string;
  studentName: string;
  studentClass: string;
  timer: string;
}

export default function ExamHeader({
  title,
  studentName,
  studentClass,
  timer,
}: ExamHeaderProps) {
  return (
    <header className="exam-header">
      <div>
        <p className="eyebrow">Computer Based Test</p>
        <h1>{title}</h1>
        <p>
          {studentName} • {studentClass}
        </p>
      </div>
      <div className="timer-box">
        <span>Sisa Waktu</span>
        <strong>{timer}</strong>
      </div>
    </header>
  );
}
