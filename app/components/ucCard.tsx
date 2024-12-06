import Link from "next/link";

interface UC {
  id: number;
  name: string;
  semestre: number;
  ano: number;
  tipo: string;
}

export default function UcCard({ uc }: { uc: UC }) {
  return (
    <Link href={`/uc/${uc.id}`}>
      <div className="border border-sky-500 p-4 rounded shadow-md hover:bg-sky-100 transition">
        <h1 className="text-lg font-medium">{uc.name}</h1>
        <p>Semester: {uc.semestre}</p>
        <p>Year: {uc.ano}</p>
        <p>Type: {uc.tipo}</p>
      </div>
    </Link>
  );
}
