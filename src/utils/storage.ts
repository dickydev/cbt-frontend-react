const SESSION_KEY = "cbt_session_token";
const OFFLINE_ANSWER_PREFIX = "cbt_answer_";

export function saveSessionToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function getSessionToken() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSessionToken() {
  localStorage.removeItem(SESSION_KEY);
}

export function saveOfflineAnswer(
  questionId: string,
  optionId: string,
  sessionToken: string,
) {
  localStorage.setItem(
    `${OFFLINE_ANSWER_PREFIX}${questionId}`,
    JSON.stringify({
      questionId,
      optionId,
      sessionToken,
      savedAt: new Date().toISOString(),
    }),
  );
}

export function getOfflineAnswers() {
  const results: Array<{
    key: string;
    questionId: string;
    optionId: string;
    sessionToken: string;
    savedAt: string;
  }> = [];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(OFFLINE_ANSWER_PREFIX)) {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw);
        results.push({ key, ...parsed });
      } catch {
        localStorage.removeItem(key);
      }
    }
  });

  return results;
}

export function removeOfflineAnswer(key: string) {
  localStorage.removeItem(key);
}
