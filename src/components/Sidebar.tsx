
export type PageName = "Dashboard" | "Students" | "Reports";

interface SidebarProps {
  page: PageName;
  setPage: (page: PageName) => void;
  open: boolean;
  onClose: () => void;
}

const navigation: {
  label: PageName;
  icon: string;
}[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "Students", icon: "♙" },
  { label: "Reports", icon: "▤" },
];

export default function Sidebar({
  page,
  setPage,
  open,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-logo">S</span>
          <span>StudentHub</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                page === item.label ? "nav-item-active" : ""
              }`}
              onClick={() => {
                setPage(item.label);
                onClose();
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {page === item.label && (
                <span className="nav-indicator">●</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">SH</div>
          <div>
            <strong>Student Admin</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>
    </>
  );
}
