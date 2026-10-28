
import type { Student } from "../types/student";
import StatCard from "../components/StatCard";

interface DashboardProps {
  students: Student[];
  onViewStudents: () => void;
}

export default function Dashboard({
  students,
  onViewStudents,
}: DashboardProps) {
  const total = students.length;
  const active = students.filter(
    (student) => student.status === "Active"
  ).length;
  const inactive = total - active;
  const averageGrade =
    total > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.grade, 0) /
            total
        )
      : 0;

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">STUDENT OVERVIEW</span>
          <h2>Welcome back, Admin! 👋</h2>
          <p>
            Keep track of your students, courses, and academic
            performance all in one place.
          </p>

          <button
            className="button button-light"
            onClick={onViewStudents}
          >
            View students <span>→</span>
          </button>
        </div>

        <div className="welcome-art" aria-hidden="true">
          <div className="art-circle">🎓</div>
          <span className="art-sparkle">✦</span>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Overview</h2>
          <p>Here's a summary of student performance.</p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Total Students"
          value={total}
          icon="♙"
          description="All registered students"
        />
        <StatCard
          title="Active Students"
          value={active}
          icon="✓"
          description="Currently active"
        />
        <StatCard
          title="Inactive Students"
          value={inactive}
          icon="◷"
          description="Currently inactive"
        />
        <StatCard
          title="Average Grade"
          value={`${averageGrade}%`}
          icon="↗"
          description="Average student score"
        />
      </section>

      <section className="content-card overview-card">
        <div className="card-heading">
          <div>
            <h2>Student management</h2>
            <p>Keep student information up to date.</p>
          </div>
          <button
            className="button button-secondary"
            onClick={onViewStudents}
          >
            Manage students →
          </button>
        </div>

        <div className="overview-bottom">
          <div className="overview-number">
            <span className="overview-number-icon">♙</span>
            <div>
              <strong>{total} students</strong>
              <span>Available in your dashboard</span>
            </div>
          </div>

          <div className="overview-progress">
            <div className="overview-progress-label">
              <span>Active student rate</span>
              <strong>
                {total ? Math.round((active / total) * 100) : 0}%
              </strong>
            </div>
            <div className="grade-track">
              <div
                className="grade-fill"
                style={{
                  width: `${total ? (active / total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
