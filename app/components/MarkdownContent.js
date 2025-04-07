import { marked } from "marked";

export default function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <div
        className="w-full bg-white py-0"
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />

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
