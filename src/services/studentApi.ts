import type { Student, Course } from "../types/student";

const API_URL = import.meta.env.VITE_STUDENTS_API_URL;

interface ApiUser {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
  avatar?: string;
  image?: string;
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  const users: ApiUser[] = await response.json();

  const courses: Course[] = [
    "React",
    "TypeScript",
    "Python",
    "Java",
  ];

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    course: courses[(user.id - 1) % courses.length],
    grade: 70 + ((user.id * 7) % 30),
    status: user.id % 2 === 0 ? "Active" : "Inactive",
    photoUrl: user.photoUrl || user.avatar || user.image || "",
  }));
}