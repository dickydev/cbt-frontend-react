export interface ExamInfo {
  id: string;
  title: string;
  description?: string | null;
  code: string;
}

export interface ExamOption {
  id: string;
  option_key: string;
  option_text: string;
  display_order: number;
}

export interface ExamQuestion {
  id: string;
  display_order: number;
  question_text: string;
  options: ExamOption[];
  selected_option_id: string | null;
}

export interface SessionExamResponse {
  session_id: string;
  session_token: string;
  student_name: string;
  student_nis: string;
  student_class: string;
  started_at: string;
  expires_at: string;
  duration_minutes: number;
  exam: ExamInfo;
  questions: ExamQuestion[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string> | null;
}
