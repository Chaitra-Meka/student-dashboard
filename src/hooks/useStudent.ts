
import { useCallback, useEffect, useState } from "react";
import { getStudents } from "../services/studentApi";
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
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      setLoading(true);
      setError("");

      try {
        const data = await getStudents();

        if (isMounted) {
          setStudents(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load students."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const addStudent = async (data: NewStudent) => {
    setStudents((current) => {
      const nextId =
        current.reduce(
          (maxId, student) => Math.max(maxId, student.id),
          0
        ) + 1;

      return [{ ...data, id: nextId }, ...current];
    });
  };

  const updateStudent = async (
    id: number,
    changes: UpdateStudent
  ) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id
          ? { ...student, ...changes }
          : student
      )
    );
  };

  const deleteStudent = async (id: number) => {
    setStudents((current) =>
      current.filter((student) => student.id !== id)
    );
  };

  const changeStatus = async (
    id: number,
    status: StudentStatus
  ) => {
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
