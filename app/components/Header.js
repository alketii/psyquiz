import { useRouter } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import { ChevronLeft } from "lucide-react";

export default function Header({
  showBackButton = false,
  backPath = "/",
  title = "Klasa",
  breadcrumbs = [],
  addPadding = false,
}) {
  const router = useRouter();

  return (
    <header className={`mb-4 ${addPadding ? "px-8 pt-8 pb-0" : ""}`}>
      <div className="flex items-center gap-4 pb-4">
        {showBackButton && (
          <button
            onClick={() => router.push(backPath)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      <Breadcrumbs items={breadcrumbs} />
    </header>
  );
}
