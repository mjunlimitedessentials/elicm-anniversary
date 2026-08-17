"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plus } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Projects", icon: LayoutGrid },
  { href: "/dashboard/new", label: "New video", icon: Plus },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col lg:gap-1 lg:overflow-visible">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:rounded-xl ${
              active ? "bg-surface text-gold" : "text-gray-400 hover:bg-surface hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
