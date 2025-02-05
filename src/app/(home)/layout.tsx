"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Fragment>
      {pathname !== "/dashboard" && (
        <Link
          href="/"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      )}
      {children}
    </Fragment>
  );
}
