import { useEffect, useMemo, useState } from "react";
import type {
  Student,
  Course,
  StudentStatus,
} from "../types/student";

import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useDebounce from "../hooks/useDebounce";

interface StudentsProps {
  students: Student[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void | Promise<void>;
  onStatusChange: (
    id: number,
    status: StudentStatus
  ) => void | Promise<void>;
  onViewProfile: (student: Student) => void;
}

const COURSES: Course[] = [
  "React",
  "TypeScript",
  "Python",
  "Java",
];

const STATUSES: StudentStatus[] = [
  "Active",
  "Inactive",
];

const USERS_PER_PAGE = 20;

export default function Students({
  students,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onStatusChange,
  onViewProfile,
}: StudentsProps) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] =
    useState<Course | "All">("All");
  const [selectedStatus, setSelectedStatus] =
    useState<StudentStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const filteredStudents = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesCourse =
        selectedCourse === "All" ||
        student.course === selectedCourse;

      const matchesStatus =
        selectedStatus === "All" ||
        student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [
    students,
    debouncedSearch,
    selectedCourse,
    selectedStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / USERS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedCourse,
    selectedStatus,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedStudents = useMemo(() => {
    const startIndex =
      (currentPage - 1) * USERS_PER_PAGE;

    return filteredStudents.slice(
      startIndex,
      startIndex + USERS_PER_PAGE
    );
  }, [filteredStudents, currentPage]);

  const firstStudent =
    filteredStudents.length === 0
      ? 0
      : (currentPage - 1) * USERS_PER_PAGE + 1;

  const lastStudent = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredStudents.length
  );

  if (loading) {
    return (
      <main className="page-content">
        <h2>Students</h2>
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-content">
        <h2>Students</h2>
        <ErrorMessage
          message={error}
          onRetry={onRetry}
        />
      </main>
    );
  }

  return (
    <main className="page-content">
      <header className="section-heading">
        <div>
          <h2>Students</h2>
          <p>
            Manage student records, courses, grades, and status.
          </p>
        </div>

        <p aria-live="polite">
          {filteredStudents.length}{" "}
          {filteredStudents.length === 1
            ? "student"
            : "students"}{" "}
          found
        </p>
      </header>

      <section
        className="students-filters"
        aria-label="Student filters"
      >
        <div className="students-search">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="filter">
          <div className="filter-group">
            <label htmlFor="course-filter">
              Course
            </label>

            <select
              id="course-filter"
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(
                  event.target.value as Course | "All"
                )
              }
            >
              <option value="All">All courses</option>

              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">
              Status
            </label>

            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as StudentStatus | "All"
                )
              }
            >
              <option value="All">All statuses</option>

              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="reset-filters-button"
            onClick={() => {
              setSearch("");
              setSelectedCourse("All");
              setSelectedStatus("All");
              setCurrentPage(1);
            }}
          >
            Reset filters
          </button>
        </div>
      </section>

      <section aria-label="Student records">
        <StudentTable
          students={paginatedStudents}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onViewProfile={onViewProfile}
        />
      </section>

      {filteredStudents.length > 0 && (
        <nav
          className="pagination"
          aria-label="Student pages"
        >
          <p aria-live="polite">
            Showing {firstStudent}–{lastStudent} of{" "}
            {filteredStudents.length}
          </p>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              Previous
            </button>

            <span aria-current="page">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}