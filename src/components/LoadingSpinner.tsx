
interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Loading students...",
}: LoadingSpinnerProps) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  );
}
