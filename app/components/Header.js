import { useRouter } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";

export default function Header({
  showBackButton = false,
  backPath = "/",
  title = "Klasa",
  breadcrumbs = [],
}) {
  const router = useRouter();

  return (
    <header className="mb-4">
      <div className="flex items-center gap-4 pb-4">
        {showBackButton && (
          <button
            onClick={() => router.push(backPath)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <Breadcrumbs items={breadcrumbs} />
    </header>
  );
}
