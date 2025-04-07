"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";

export default function VocabularyPage() {
  const params = useParams();
  const { semesterId, classId } = params;

  const [vocabulary, setVocabulary] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVocabulary() {
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

        // Then fetch the vocabulary content
        const vocabularyResponse = await fetch(
          `/api/semesters/${semesterId}/classes/${classId}/vocabulary`
        );

        if (!vocabularyResponse.ok) {
          throw new Error("Failed to fetch vocabulary");
        }

        const vocabularyData = await vocabularyResponse.json();
        setVocabulary(vocabularyData);
      } catch (error) {
        console.error("Error loading vocabulary:", error);
      } finally {
        setLoading(false);
      }
    }

    if (semesterId && classId) {
      fetchVocabulary();
    }
  }, [semesterId, classId]);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Header
        showBackButton={true}
        backPath={`/semester/${semesterId}/class/${classId}`}
        title="Fjalori"
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
            href: `/semester/${semesterId}/class/${classId}/vocabulary`,
            label: "Fjalori",
          },
        ]}
      />

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar fjalorin...</p>
        ) : vocabulary ? (
          <MarkdownContent content={vocabulary.content} />
        ) : (
          <p>Fjalori nuk është i disponueshëm.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
