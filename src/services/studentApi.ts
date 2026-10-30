import type {
  NewStudent,
  Student,
  StudentStatus,
  UpdateStudent,
} from "../types/student";

const API_BASE_URL = (
  import.meta.env.VITE_STUDENTS_API_URL ).trim();
const DUMMY_API_URL =
  import.meta.env.VITE_DUMMY_API_URL;

const STUDENTS_URL = `${API_BASE_URL}/students/`;



interface DummyUser {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photoUrl?: string;
  image?: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `API request failed (${response.status}): ${details}`,
    );
  }

  return response.json() as Promise<T>;
}

function sortStudents(students: Student[]): Student[] {
  return [...students].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    }),
  );
}

function getDummyRecords(data: unknown): DummyUser[] {
  let records: unknown = data;

  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  ) {
    const result = data as Record<string, unknown>;

    if (Array.isArray(result.users)) {
      records = result.users;
    } else if (Array.isArray(result.items)) {
      records = result.items;
    } else if (Array.isArray(result.data)) {
      records = result.data;
    }
  }

  if (!Array.isArray(records)) {
    throw new Error("Invalid Dummy API response.");
  }

  return records.map((record): DummyUser => {
    if (typeof record !== "object" || record === null) {
      throw new Error("Invalid dummy student record.");
    }

    return record as DummyUser;
  });
}

function mapDummyStudent(
  user: DummyUser,
  index: number,
): Student {
  const fullName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Unknown Student";

  return {
    id: -(index + 1),
    name: fullName,
    email: user.email ?? "",
    course: "React",
    grade: 80,
    status: "Active",
    photoUrl: user.photoUrl ?? user.image ?? "",
  };
}

// Get students from Dummy API
async function getDummyStudents(): Promise<Student[]> {
  const response = await fetch(DUMMY_API_URL);

  const data = await readResponse<unknown>(response);

  const records = getDummyRecords(data);

  return records.map((user, index) =>
    mapDummyStudent(user, index),
  );
}

// Get students from PostgreSQL
async function getDatabaseStudents(): Promise<Student[]> {
  let response: Response;

  try {
    response = await fetch(STUDENTS_URL);
  } catch {
    throw new Error(
      `Cannot connect to the backend at ${STUDENTS_URL}. Check that FastAPI is running.`,
    );
  }

  const data = await readResponse<unknown>(response);

  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: expected a student array.");
  }

  return data as Student[];
}


export async function getStudents(): Promise<Student[]> {
  const [dummyResult, databaseResult] =
    await Promise.allSettled([
      getDummyStudents(),
      getDatabaseStudents(),
    ]);

  const dummyStudents =
    dummyResult.status === "fulfilled"
      ? dummyResult.value
      : [];

  const databaseStudents =
    databaseResult.status === "fulfilled"
      ? databaseResult.value
      : [];

  if (
    dummyResult.status === "rejected" &&
    databaseResult.status === "rejected"
  ) {
    throw new Error(
      "Both Dummy API and PostgreSQL API failed."
    );
  }

  if (dummyResult.status === "rejected") {
    console.warn("Dummy API error:", dummyResult.reason);
  }

  if (databaseResult.status === "rejected") {
    console.warn("Database API error:", databaseResult.reason);
  }

  const combinedStudents = [
    ...dummyStudents,
    ...databaseStudents,
  ];

  return sortStudents(combinedStudents).map((student, index) => ({
    ...student,
    displayId: index + 1,
  }));
}

// Add student to PostgreSQL
export async function createStudent(
  data: NewStudent,
): Promise<Student> {
  const response = await fetch(STUDENTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readResponse<Student>(response);
}

// Update PostgreSQL student
export async function updateStudentApi(
  id: number,
  changes: UpdateStudent,
): Promise<Student> {
  if (id < 0) {
    throw new Error("Dummy API students cannot be updated.");
  }

  const response = await fetch(`${STUDENTS_URL}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  return readResponse<Student>(response);
}

// Delete PostgreSQL student
export async function deleteStudentApi(
  id: number,
): Promise<void> {
  if (id < 0) {
    throw new Error("Dummy API students cannot be deleted.");
  }

  const response = await fetch(`${STUDENTS_URL}${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Failed to delete student (${response.status}): ${details}`,
    );
  }
}

// Update student status
export async function updateStudentStatusApi(
  id: number,
  status: StudentStatus,
): Promise<Student> {
  return updateStudentApi(id, { status });
}