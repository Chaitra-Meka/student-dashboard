
import { memo } from "react";
import type {
  Student,
  StudentStatus,
} from "../types/student";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onStatusChange: (
    id: number,
    status: StudentStatus
  ) => void;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function StudentTableComponent({
  students,
  onEdit,
  onDelete,
  onStatusChange,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          ⌕
        </div>
        <h3>No students found</h3>
        <p>Try a different search or change your filters.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="student-table">
        <thead>
          <tr>
            <th scope="col">STUDENT</th>
            <th scope="col">COURSE</th>
            <th scope="col">GRADE</th>
            <th scope="col">STATUS</th>
            <th scope="col" className="actions-heading">
              ACTIONS
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="student-identity">
                  {student.photoUrl ? (
                    <img
                      className="student-avatar"
                      src={student.photoUrl}
                      alt=""
                    />
                  ) : (
                    <div
                      className="student-avatar avatar-fallback"
                      aria-hidden="true"
                    >
                      {getInitials(student.name)}
                    </div>
                  )}

                  <div className="student-identity-details">
                    <strong>{student.name}</strong>
                    <span>{student.email}</span>
                  </div>
                </div>
              </td>

              <td>
                <span className="course-pill">
                  {student.course}
                </span>
              </td>

              <td>
                <div className="grade-cell">
                  <div className="grade-label">
                    <strong>{student.grade}%</strong>
                  </div>

                  <div
                    className="grade-track"
                    role="progressbar"
                    aria-label={`Grade for ${student.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={student.grade}
                  >
                    <div
                      className="grade-fill"
                      style={{
                        width: `${student.grade}%`,
                      }}
                    />
                  </div>
                </div>
              </td>

              <td>
                <select
                  className={`status-select status-${student.status.toLowerCase()}`}
                  aria-label={`Status for ${student.name}`}
                  value={student.status}
                  onChange={(event) =>
                    onStatusChange(
                      student.id,
                      event.target.value as StudentStatus
                    )
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="icon-button"
                    title="Edit student"
                    aria-label={`Edit ${student.name}`}
                    onClick={() => onEdit(student)}
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    className="icon-button delete-action"
                    title="Delete student"
                    aria-label={`Delete ${student.name}`}
                    onClick={() => onDelete(student.id)}
                  >
                    ♲
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(StudentTableComponent);
