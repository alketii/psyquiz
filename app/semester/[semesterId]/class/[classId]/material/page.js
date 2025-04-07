"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { marked } from "marked";

export default function MaterialPage() {
  const params = useParams();
  const router = useRouter();
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
    <div className="flex flex-col min-h-screen p-8">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() =>
              router.push(`/semester/${semesterId}/class/${classId}`)
            }
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            ← Kthehu
          </button>

          <h1 className="text-3xl font-bold">Klasa</h1>
        </div>

        {classData && (
          <div>
            <p className="text-lg text-gray-600">{classData.semester.name}</p>
            <h2 className="text-2xl font-semibold">{classData.className}</h2>
            <h3 className="text-xl font-medium mt-2">Materiali i përpunuar</h3>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {loading ? (
          <p>Duke ngarkuar materialin...</p>
        ) : material ? (
          <div
            className="markdown-content w-full bg-white py-4 md:py-8 rounded-lg shadow"
            dangerouslySetInnerHTML={{ __html: marked.parse(material.content) }}
          />
        ) : (
          <p>Materiali nuk është i disponueshëm.</p>
        )}
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} A.R.</p>
      </footer>

      <style jsx global>{`
        .markdown-content {
          width: 100%;
          max-width: 100%;
          padding-left: 0;
          padding-right: 0;
        }
        .markdown-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          color: #111827;
          width: 100%;
          padding-left: 0;
          padding-right: 0;
        }
        .markdown-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        .markdown-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #374151;
        }
        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .markdown-content a {
          color: #2563eb;
          text-decoration: none;
        }
        .markdown-content a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .markdown-content strong {
          font-weight: 700;
          color: #111827;
        }
        .markdown-content em {
          font-style: italic;
          color: #4b5563;
        }
        .markdown-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1rem 0;
        }
        .markdown-content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          color: #111827;
        }
        .markdown-content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
