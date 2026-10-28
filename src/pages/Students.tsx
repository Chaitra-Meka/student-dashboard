
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useDebounce from "../hooks/useDebounce";

import type {
  Course,
  Student,
  StudentStatus,
} from "../types/student";

interface StudentsProps {
  students: Student[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: StudentStatus) => void;
}

const courses: Course[] = [
  "React",
  "TypeScript",
  "Python",
  "Java",
];

const  USERS_PER_PAGE  = 20;

export default function Students({
  students,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onStatusChange,
}: StudentsProps) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const filteredStudents = useMemo(() => {
  const query = debouncedSearch.trim().toLowerCase();
    

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesCourse =
        course === "All" || student.course === course;

      const matchesStatus =
        status === "All" || student.status === status;

        return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, debouncedSearch, course, status]);

        const totalPages = Math.ceil(filteredStudents.length / USERS_PER_PAGE);

const startIndex = (currentPage - 1) * USERS_PER_PAGE;

const currentStudents = filteredStudents.slice(
  startIndex,
  startIndex + USERS_PER_PAGE
);


      

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, course, status]);

   useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, Math.max(totalPages, 1))
    );
  }, [totalPages]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRetry}
      />
    );
  }
  return (
    <div className="page-content">
      <div className="section-heading students-heading">
        <div>
          <h2>All Students</h2>
          <p>Search, filter, and manage your student records.</p>
        </div>
        <span className="result-count">
          {filteredStudents.length} students
        </span>
      </div>

      <section className="content-card students-card">
        <div className="filters-toolbar">
          <SearchBar value={search} onChange={setSearch} />

          <label className="filter-control">
            <span>Course</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option value="All">All courses</option>
              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-control">
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <button
            className="button button-secondary clear-filters"
            onClick={() => {
              setSearch("");
              setCourse("All");
              setStatus("All");
              setCurrentPage(1);
            }}
          >
            Reset
          </button>
        </div>
        
        {currentStudents.length > 0 ? (
        <StudentTable
          students={currentStudents}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
        ) : (
            <p className="empty-state">
            No students found. Try changing your search or filters.
          </p>
        )}

         <div className="pagination">
          <p className="pagination-info">
            Showing{" "}
            {filteredStudents.length === 0
              ? 0
              : startIndex + 1}
            {" "}to{" "}
            {Math.min(
              startIndex + USERS_PER_PAGE,
              filteredStudents.length
            )}
            {" "}of {filteredStudents.length} students
          </p>

          <div className="pagination-controls">
            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="pagination-page">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(Math.max(totalPages, 1), page + 1)
                )
              }
              disabled={
                totalPages === 0 ||
                currentPage >= totalPages
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
