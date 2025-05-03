// src/types/lesson.ts

export interface LessonList {
  id: string;
  lesson_code: string;
  lesson_name: string;
  credits: number;
  description?: string;
  teacher_id?: string | null;
  school_year?: number | null;
  type?: "Gen" | "Pro" | null;
  semester?: "Хавар" | "Намар" | null;
  image?: string | null;
  teacher?: {
    name: string;
    user_id: string;
  };
}

export interface Lesson {
  id: number;
  lessonCode: string;
  title: string;
  description?: string;
  week?: number | null;
  pdfUrl?: string | null;
  videoUrl?: string | null;
  school_year?: number | null;
  createdAt: string;
  updatedAt: string;
  teacherId: string;
  Code?: {
    lesson_name: string;
    lesson_code: string;
  };
  Id?: {
    user_id: string;
    name: string;
  };
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  teacherId: string;
  fileUrl: string;
  score?: number;
  createdAt: string;
  assignment?: Assignment;
  student?: User;
  teacher?: User;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  course: number;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher?: User;
  submissions?: Submission[];
}

export interface User {
  id: string;
  user_id: string;
  name: string;
  role: "teacher" | "student" | "admin";
  school_year?: number | null;
  email: string;
  image?: string | null;
}
