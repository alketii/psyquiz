import Link from "next/link";
import { Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="text-sm text-gray-600 mb-4 flex items-center pl-1 overflow-hidden">
      <div className="flex items-center whitespace-nowrap overflow-hidden">
        {items.slice(0, -1).map((item, index) => (
          <span key={item.href} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <Link
              href={item.href}
              className="hover:text-blue-600 flex items-center truncate"
            >
              {item.href === "/" ? <Home className="w-4 h-4" /> : item.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
