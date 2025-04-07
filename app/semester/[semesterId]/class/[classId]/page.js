"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

export default function ClassPage() {
  const params = useParams();
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
      <Header
        showBackButton={true}
        backPath={`/semester/${semesterId}`}
        title={classData?.className || "Lënda"}
        breadcrumbs={[
          { href: "/", label: "Kryefaqja" },
          {
            href: `/semester/${semesterId}`,
            label: classData?.semester.name || "Semestri",
          },
          {
            href: `/semester/${semesterId}/class/${classId}`,
            label: classData?.className || "Lënda",
          },
        ]}
      />

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar lëndën...</p>
        ) : classData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <a
              href={`/data/${semesterId}/${classData.classId}/original.pdf`}
              download={`${classData.classId}-${semesterId}.pdf`}
              className="block p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">📄</div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    Materiali original
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Te gjitha slide-t e lëndës në një PDF
                  </p>
                </div>
              </div>
            </a>

            <Link
              href={`/semester/${semesterId}/class/${classId}/material`}
              className="block p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">📚</div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    Materiali i përpunuar
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Materiali i përpunuar në PDF
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={`/semester/${semesterId}/class/${classId}/vocabulary`}
              className="block p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">📖</div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">Fjalor</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Fjalët kyçe të lëndës
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={`/semester/${semesterId}/class/${classId}/quiz`}
              className="block p-4 md:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">❓</div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">Kuiz</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Testoni njohuritë tuaja
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <p>Lënda nuk u gjet.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
