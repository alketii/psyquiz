"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SemesterPage() {
  const params = useParams();
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
      <Header
        showBackButton={true}
        title={semester?.name || "Semestri"}
        breadcrumbs={[
          { href: "/", label: "Kryefaqja" },
          {
            href: `/semester/${semesterId}`,
            label: semester?.name || "Semestri",
          },
        ]}
      />

      <main className="flex-grow">
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

      <Footer />
    </div>
  );
}
