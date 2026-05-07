import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export const Toast = () => {
  const { feedback, dismissFeedback } = useApp();

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(dismissFeedback, 3600);
    return () => window.clearTimeout(timer);
  }, [dismissFeedback, feedback]);

  if (!feedback) return null;

  return (
    <aside className={`toast toast-${feedback.tone}`} role="status">
      <strong>{feedback.title}</strong>
      <span>{feedback.detail}</span>
      <button type="button" onClick={dismissFeedback} aria-label="关闭提示 / Close message">
        ×
      </button>
    </aside>
  );
};
