import type { Student } from "../types/student";

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
}

export default function StudentProfile({
  student,
  onBack,
  onEdit,
}: StudentProfileProps) {
  return (
    <main className="page-content">
      <button type="button" onClick={onBack}>
        ← Back to Students
      </button>

      <section className="student-profile">
        <div className="profile-header">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={`${student.name}'s profile`}
              className="profile-photo"
            />
          ) : (
            <div className="profile-placeholder" aria-hidden="true">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2>{student.name}</h2>
            <p className="profile-id">
              Student ID: <strong>{student.displayId ?? student.id}</strong>
            </p>
            <span
              className={`profile-status ${student.status.toLowerCase()}`}
            >
              {student.status}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <h3>Student Information</h3>

          <p>
            <strong>Student ID:</strong> {student.displayId ?? student.id}
          </p>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Course:</strong> {student.course}
          </p>
          <p>
            <strong>Grade:</strong> {student.grade}
          </p>
          <p>
            <strong>Status:</strong> {student.status}
          </p>
        </div>

        <button type="button" onClick={() => onEdit(student)}>
          Edit Student
        </button>
      </section>
    </main>
  );
}