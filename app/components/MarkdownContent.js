import { marked } from "marked";

export default function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <div
        className="w-full py-0 px-4 sm:px-6 md:px-8"
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />

      <style jsx global>{`
        .markdown-content {
          width: 100%;
          max-width: 100%;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, Segoe UI,
            Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
          padding: 1.5rem 0;
          border-radius: 0.5rem;
        }

        .markdown-content > div {
          max-width: 768px;
          margin: 0 auto;
        }

        .markdown-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #111827;
          line-height: 1.2;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .markdown-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .markdown-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
          line-height: 1.4;
        }

        .markdown-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }

        .markdown-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .markdown-content h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .markdown-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #374151;
        }

        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-bottom: 1.25rem;
        }

        .markdown-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-bottom: 1.25rem;
        }

        .markdown-content li {
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.7;
        }

        .markdown-content li > ul,
        .markdown-content li > ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .markdown-content a {
          color: #2563eb;
          text-decoration: none;
          transition: color 0.15s ease;
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
          border-left: 4px solid #3b82f6;
          padding: 0.75rem 1.25rem;
          background-color: #eff6ff;
          border-radius: 0.25rem;
          margin: 1.5rem 0;
          color: #1e3a8a;
        }

        .markdown-content blockquote p {
          margin: 0;
        }

        .markdown-content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          color: #111827;
          font-size: 0.875rem;
        }

        .markdown-content pre {
          background-color: #1f2937;
          padding: 1.25rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          color: #e5e7eb;
        }

        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
          font-size: 0.875rem;
          line-height: 1.7;
        }

        .markdown-content hr {
          border: 0;
          height: 1px;
          background-color: #e5e7eb;
          margin: 2rem 0;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1.5rem 0;
          display: block;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          overflow-x: auto;
          display: block;
        }

        .markdown-content table thead {
          background-color: #f3f4f6;
        }

        .markdown-content table th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
        }

        .markdown-content table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .markdown-content table tr:hover {
          background-color: #f9fafb;
        }

        /* Add support for definition lists */
        .markdown-content dl {
          margin-bottom: 1.25rem;
        }

        .markdown-content dt {
          font-weight: 700;
          color: #111827;
          margin-top: 1rem;
        }

        .markdown-content dd {
          margin-left: 1.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.75rem;
        }

        /* Improved styling for horizontal rules with semantic sections */
        .markdown-content hr + h1,
        .markdown-content hr + h2,
        .markdown-content hr + h3 {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
