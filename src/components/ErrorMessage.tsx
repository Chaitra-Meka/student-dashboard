
interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-state" role="alert">
      <h3>Unable to load data</h3>
      <p>{message}</p>
      <button className="button button-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
