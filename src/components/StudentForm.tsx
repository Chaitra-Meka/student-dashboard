
import { useState } from "react";
import StudentPhotoUpload from "./StudentPhotoUpload";
import type {
  Course,
  NewStudent,
  Student,
} from "../types/student";

interface StudentFormProps {
  student: Student | null;
  onSave: (data: NewStudent) => Promise<void>;
  onClose: () => void;
}

const courses: Course[] = [
  "React",
  "TypeScript",
  "Python",
  "Java",
];

const emptyForm: NewStudent = {
  name: "",
  email: "",
  course: "React",
  grade: 80,
  status: "Active",
  photoUrl: "",
};

function getInitialForm(student: Student | null): NewStudent {
  if (!student) {
    return { ...emptyForm };
  }

  return {
    name: student.name,
    email: student.email,
    course: student.course,
    grade: student.grade,
    status: student.status,
    photoUrl: student.photoUrl ?? "",
  };
}

export default function StudentForm({
  student,
  onSave,
  onClose,
}: StudentFormProps) {
  const [form, setForm] = useState<NewStudent>(
    () => getInitialForm(student)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof NewStudent>(
    field: K,
    value: NewStudent[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter the student's name.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      !Number.isFinite(form.grade) ||
      form.grade < 0 ||
      form.grade > 100
    ) {
      setError("Grade must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });

      onClose();
    } catch {
      setError("Unable to save the student. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        className="student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="student-form-title">
              {student ? "Edit Student" : "Add Student"}
            </h2>
            <p>Enter the student's information below.</p>
          </div>

          <button
            className="close-button"
            type="button"
            onClick={onClose}
            aria-label="Close form"
            disabled={saving}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <StudentPhotoUpload
              value={form.photoUrl ?? ""}
              onChange={(value) =>
                updateField("photoUrl", value)
              }
            />

            <div className="form-grid">
              <label className="form-field">
                Full name *
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                   style={{ textTransform: "capitalize" }}
                  placeholder="Enter full name"
                 
                  autoComplete="name"
                  required
                />
              </label>

              <label className="form-field">
                Email address *
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="student@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="form-field">
                Course
                <select
                  value={form.course}
                  onChange={(event) =>
                    updateField(
                      "course",
                      event.target.value as Course
                    )
                  }
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                Grade (0–100)
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.grade}
                  onChange={(event) =>
                    updateField(
                      "grade",
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value)
                    )
                  }
                  required
                />
              </label>

              <label className="form-field form-field-full">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as NewStudent["status"]
                    )
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="button button-secondary"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="button button-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : student
                  ? "Save Changes"
                  : "Add Student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
