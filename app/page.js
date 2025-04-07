"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      <Header
        title="Semestrat"
        breadcrumbs={[{ href: "/", label: "Kryefaqja" }]}
      />

      <main className="flex-grow">
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

      <Footer />
    </div>
  );
}
