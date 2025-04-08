"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";

export default function MaterialPage() {
  const params = useParams();
  const { semesterId, classId } = params;

  const [material, setMaterial] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        // Fetch class details first
        const classResponse = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}`
        );

        if (!classResponse.ok) {
          throw new Error("Failed to fetch class data");
        }

        const classData = await classResponse.json();
        setClassData(classData);

        // Then fetch the material content
        const materialResponse = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}/material`
        );

        if (!materialResponse.ok) {
          throw new Error("Failed to fetch material");
        }

        const materialData = await materialResponse.json();
        setMaterial(materialData);
      } catch (error) {
        console.error("Error loading material:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId && classId) {
      fetchMaterial();
    }
  }, [semesterId, classId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        showBackButton={true}
        backPath={`/semester/${semesterId}/class/${classId}`}
        title="Materiali i përpunuar"
        addPadding={true}
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
          {
            href: `/semester/${semesterId}/class/${classId}/material`,
            label: "Materiali i përpunuar",
          },
        ]}
      />

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar materialin...</p>
        ) : material ? (
          <MarkdownContent content={material.content} />
        ) : (
          <p>Materiali nuk është i disponueshëm.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
