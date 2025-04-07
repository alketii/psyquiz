import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && <span className="mx-2">/</span>}
          {index === items.length - 1 ? (
            <span className="text-gray-900">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
