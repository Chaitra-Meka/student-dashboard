import {
  lazy,
  Suspense,
  useState,
} from "react";

import Sidebar, {
  type PageName,
} from "./components/Sidebar";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentProfile from "./components/StudentProfile";
import LoadingSpinner from "./components/LoadingSpinner";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import useStudents from "./hooks/useStudent";

import type {
  NewStudent,
  Student,
  StudentStatus,
} from "./types/student";

const StudentReports = lazy(
  () => import("./pages/StudentReports")
);

export default function App() {
  const {
    students,
    loading,
    error,
    refreshStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    changeStatus,
  } = useStudents();

  const [page, setPage] = useState<PageName>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  function openAddForm() {
    setEditingStudent(null);
    setSelectedStudent(null);
    setFormOpen(true);
  }

  function openEditForm(student: Student) {
    setSelectedStudent(null);
    setEditingStudent(student);
    setFormOpen(true);
  }

  function openStudentProfile(student: Student) {
    setSelectedStudent(student);
  }

  async function handleSave(data: NewStudent) {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await addStudent(data);
    }

    setFormOpen(false);
    setEditingStudent(null);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmed) {
      await deleteStudent(id);

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    }
  }

  async function handleStatusChange(
    id: number,
    status: StudentStatus
  ) {
    await changeStatus(id, status);
  }

  function navigateTo(nextPage: PageName) {
    setPage(nextPage);
    setSelectedStudent(null);
  }

  const currentProfile = selectedStudent
    ? students.find(
        (student) => student.id === selectedStudent.id
      ) ?? selectedStudent
    : null;

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={navigateTo}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        <Header
          page={page}
          onMenuClick={() => setSidebarOpen(true)}
          onAddStudent={openAddForm}
        />

        {page === "Dashboard" && (
          <Dashboard
            students={students}
            onViewStudents={() => setPage("Students")}
          />
        )}

        {page === "Students" && currentProfile && (
          <StudentProfile
            student={currentProfile}
            onBack={() => setSelectedStudent(null)}
            onEdit={openEditForm}
          />
        )}

        {page === "Students" && !currentProfile && (
          <Students
            students={students}
            loading={loading}
            error={error}
            onRetry={refreshStudents}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onViewProfile={openStudentProfile}
          />
        )}

        {page === "Reports" && (
          <Suspense
            fallback={
              <LoadingSpinner message="Loading reports..." />
            }
          >
            <StudentReports students={students} />
          </Suspense>
        )}
      </main>

      {formOpen && (
        <StudentForm
          key={editingStudent?.id ?? "new-student"}
          student={editingStudent}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}