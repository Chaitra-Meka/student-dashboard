
import { useCallback, useEffect, useState } from "react";

import {
  getStudents,
  createStudent,
  updateStudentApi,
  deleteStudentApi,
} from "../services/studentApi";

import type {
  NewStudent,
  Student,
  StudentStatus,
  UpdateStudent,
} from "../types/student";

export default function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load students.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStudents().catch(() => {
      // The error is stored in state and displayed by the page.
    });
  }, [refreshStudents]);

  const addStudent = async (data: NewStudent): Promise<void> => {
    setError("");

    try {
      const createdStudent = await createStudent(data);

      setStudents((current) => [createdStudent, ...current]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to add student.";

      setError(message);
      throw err;
    }
  };

  const updateStudent = async (
    id: number,
    changes: UpdateStudent
  ): Promise<void> => {
    setError("");

    try {
      const updatedStudent = await updateStudentApi(id, changes);

      setStudents((current) =>
        current.map((student) =>
          student.id === id ? updatedStudent : student
        )
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update student.";

      setError(message);
      throw err;
    }
  };

  const deleteStudent = async (id: number): Promise<void> => {
    setError("");

    try {
      await deleteStudentApi(id);

      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to delete student.";

      setError(message);
      throw err;
    }
  };

  const changeStatus = async (
    id: number,
    status: StudentStatus
  ): Promise<void> => {
    await updateStudent(id, { status });
  };

  return {
    students,
    loading,
    error,
    refreshStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    changeStatus,
  };
}
