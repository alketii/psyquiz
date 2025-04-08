"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Book, BookOpen, BookText, Brain } from "lucide-react";

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
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    <Book size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold pb-2">
                      {classItem.name}
                    </h3>
                    <div className="text-gray-600">
                      <span className="text-sm">{classItem.professor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {classItem.hasMainMaterial && (
                    <Book
                      className="w-5 h-5 text-blue-500"
                      title="Materiali kryesor"
                    />
                  )}
                  {classItem.hasVocabulary && (
                    <Brain className="w-5 h-5 text-green-500" title="Fjalor" />
                  )}
                  {classItem.hasAlternativeMaterial && (
                    <BookOpen
                      className="w-5 h-5 text-purple-500"
                      title="Material alternativ"
                    />
                  )}
                  {classItem.hasQuiz && (
                    <BookText
                      className="w-5 h-5 text-orange-500"
                      title="Kuiz"
                    />
                  )}
                </div>
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
