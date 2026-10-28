
import type { PageName } from "./Sidebar";

interface HeaderProps {
  page: PageName;
  onMenuClick: () => void;
  onAddStudent: () => void;
}

const descriptions: Record<PageName, string> = {
  Dashboard: "Here's what's happening with your students.",
  Students: "Manage student profiles and academic details.",
  Reports: "Review student performance and course statistics.",
};

export default function Header({
  page,
  onMenuClick,
  onAddStudent,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div>
          <h1>{page}</h1>
          <p>{descriptions[page]}</p>
        </div>
      </div>

      <button
        className="button button-primary"
        onClick={onAddStudent}
      >
        <span>＋</span> Add Student
      </button>
    </header>
  );
}
