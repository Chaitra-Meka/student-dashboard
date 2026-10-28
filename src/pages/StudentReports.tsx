
import { useEffect, useState } from "react";
import type { Course, Student } from "../types/student";
import LoadingSpinner from "../components/LoadingSpinner";

interface StudentReportsProps {
  students: Student[];
}

const courses: Course[] = [
  "React",
  "TypeScript",
  "Python",
  "Java",
];

export default function StudentReports({
  students,
}: StudentReportsProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) {
    return <LoadingSpinner message="Preparing reports..." />;
  }

  const averageGrade = students.length
    ? Math.round(
        students.reduce((sum, student) => sum + student.grade, 0) /
          students.length
      )
    : 0;

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  return (
    <div className="page-content">
      <div className="section-heading">
        <div>
          <h2>Student Reports</h2>
          <p>Explore enrollment and academic performance.</p>
        </div>
      </div>

      <div className="report-summary-grid">
        <article className="content-card report-summary">
          <span>Total students</span>
          <strong>{students.length}</strong>
          <small>Across all courses</small>
        </article>

        <article className="content-card report-summary">
          <span>Average grade</span>
          <strong>{averageGrade}%</strong>
          <small>Mean student score</small>
        </article>

        <article className="content-card report-summary">
          <span>Active rate</span>
          <strong>
            {students.length
              ? Math.round((activeCount / students.length) * 100)
              : 0}
            %
          </strong>
          <small>Of all students</small>
        </article>
      </div>

      <section className="content-card report-chart-card">
        <div className="card-heading">
          <div>
            <h2>Students by course</h2>
            <p>Number of students enrolled in each course.</p>
          </div>
        </div>

        <div className="bar-chart">
          {courses.map((course) => {
            const count = students.filter(
              (student) => student.course === course
            ).length;

            const percentage = students.length
              ? (count / students.length) * 100
              : 0;

            return (
              <div className="bar-row" key={course}>
                <div className="bar-row-heading">
                  <span>{course}</span>
                  <strong>{count}</strong>
                </div>

                <div
                  className="bar-track"
                  role="progressbar"
                  aria-label={`${course} students`}
                  aria-valuemin={0}
                  aria-valuemax={students.length || 1}
                  aria-valuenow={count}
                >
                  <div
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="content-card report-chart-card">
        <div className="card-heading">
          <div>
            <h2>Grade distribution</h2>
            <p>Students grouped by grade range.</p>
          </div>
        </div>

        <div className="grade-distribution">
          {[
            { label: "90–100%", min: 90, max: 100 },
            { label: "80–89%", min: 80, max: 89 },
            { label: "70–79%", min: 70, max: 79 },
            { label: "Below 70%", min: 0, max: 69 },
          ].map((range) => {
            const count = students.filter(
              (student) =>
                student.grade >= range.min &&
                student.grade <= range.max
            ).length;

            return (
              <div className="distribution-item" key={range.label}>
                <span>{range.label}</span>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
