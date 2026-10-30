export type Course =
   "React"
  | "TypeScript"
  | "Python"
  | "Java";

export type StudentStatus = "Active" | "Inactive";

export interface Student {
  id: number;
  displayId?: number;
  name: string;
  email: string;
  course: Course;
  grade : number ;
  status: StudentStatus;
  photoUrl?: string;
 }

export type NewStudent = Omit<Student, "id">;
export type UpdateStudent = Partial<NewStudent>;