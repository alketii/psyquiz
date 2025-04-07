"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SemesterPage() {
  const params = useParams();
  const router = useRouter();
  const { semesterId } = params;

  const [semester, setSemester] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch(`/api/semesters/${semesterId}/classes`);

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setSemester(data.semester);
        setClasses(data.classes);
      } catch (error) {
        console.error("Error loading classes:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId) {
      fetchClasses();
    }
  }, [semesterId]);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push("/")}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Kthehu
          </button>

          <h1 className="text-3xl font-bold">Klasa</h1>
        </div>
        {semester && <p className="text-xl text-gray-700">{semester.name}</p>}
      </header>

      <main className="flex-grow">
        <h2 className="text-2xl font-semibold mb-6">Lëndët e disponueshme</h2>

        {loading ? (
          <p>Duke ngarkuar lëndët...</p>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Link
                href={`/semester/${semesterId}/class/${classItem.id}`}
                key={classItem.id}
                className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
              >
                <h3 className="text-xl font-semibold">{classItem.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p>Nuk u gjetën lëndët për këtë semestër.</p>
        )}
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} A.R.</p>
      </footer>
    </div>
  );
}
