import Link from "next/link";

export default function CourseCard({ course }: any) {
  return (
    <Link href={`/course/${course.id}?courseName=${course.courseName}`}>
      <div className="border border-sky-500 p-4 rounded shadow-md pointer hover:bg-sky-100">
        <h1 className="text-lg font-medium">{course.courseName}</h1>
      </div>
    </Link>
  );
}
