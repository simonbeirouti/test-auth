import {dashboardLinks} from "@/src/data";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col mx-auto gap-6">
      <div className="flex flex-row justify-between items-center bg-black border border-emerald-400/20 rounded-lg p-4">
        <Link href={dashboardLinks[0].href} className="text-emerald-400 hover:text-emerald-400/70 transition-colors duration-300">
          {dashboardLinks[0].label}
        </Link>
        <div className="flex gap-4">
          {dashboardLinks.slice(1).map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-emerald-400 hover:text-emerald-400/70 transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
