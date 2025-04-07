"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSemesters() {
      try {
        const response = await fetch("/api/semesters");
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error("Error loading semesters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSemesters();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Klasa</h1>
        <p className="text-gray-600"></p>
      </header>

      <main className="flex-grow">
        <h2 className="text-2xl font-semibold mb-6">Semestrat</h2>

        {loading ? (
          <p>Duke ngarkuar semestrat...</p>
        ) : semesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.map((semester) => (
              <Link
                href={`/semester/${semester.id}`}
                key={semester.id}
                className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
              >
                <h3 className="text-xl font-semibold">
                  {semester.name.replace("Semester", "Semestri")}
                </h3>
                <p className="text-gray-600 mt-2">
                  {semester.classCount}{" "}
                  {semester.classCount === 1 ? "klasë" : "klasa"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p>Nuk u gjetën semestra.</p>
        )}
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} A.R.</p>
      </footer>
    </div>
  );
}
