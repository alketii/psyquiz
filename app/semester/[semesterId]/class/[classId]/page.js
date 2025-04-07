"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ClassPage() {
  const params = useParams();
  const router = useRouter();
  const { semesterId, classId } = params;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClassData() {
      try {
        const response = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }

        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error("Error loading class data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId && classId) {
      fetchClassData();
    }
  }, [semesterId, classId]);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push(`/semester/${semesterId}`)}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Classes
          </button>

          <h1 className="text-3xl font-bold">Klasa</h1>
        </div>

        {classData && (
          <div>
            <p className="text-lg text-gray-600">{classData.semester.name}</p>
            <h2 className="text-2xl font-semibold">{classData.className}</h2>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar lëndën...</p>
        ) : classData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href={`/data/${semesterId}/${classData.classId}/original.pdf`}
              download={`${classData.classId}-${semesterId}.pdf`}
              // download="original.pdf"
              className="block p-8 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition text-center"
            >
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Materiali original</h3>
              <p className="text-gray-600">
                Shkarkoni materialin origjinal të lëndës
              </p>
            </a>

            <Link
              href={`/semester/${semesterId}/class/${classId}/material`}
              className="block p-8 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition text-center"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">
                Materiali i përpunuar
              </h3>
              <p className="text-gray-600">
                Shikoni përmbajtjen dhe materialet e lëndës
              </p>
            </Link>

            <Link
              href={`/semester/${semesterId}/class/${classId}/vocabulary`}
              className="block p-8 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition text-center"
            >
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">Fjalor</h3>
              <p className="text-gray-600">Shikoni fjalorin e lëndës</p>
            </Link>

            <Link
              href={`/semester/${semesterId}/class/${classId}/quiz`}
              className="block p-8 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition text-center"
            >
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-semibold mb-2">Kuiz</h3>
              <p className="text-gray-600">Testoni njohuritë tuaja me kuizet</p>
            </Link>
          </div>
        ) : (
          <p>Lënda nuk u gjet.</p>
        )}
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} A.R.</p>
      </footer>
    </div>
  );
}
