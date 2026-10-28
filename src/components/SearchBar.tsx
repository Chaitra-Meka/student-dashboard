
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Search by name or email..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search students"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
