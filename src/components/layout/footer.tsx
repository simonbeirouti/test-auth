import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-emerald-400/20 mt-8">
      <div className="flex flex-col items-center justify-center gap-2 text-emerald-400/50 text-sm">
        <div>© {new Date().getFullYear()} Coin Fi. All rights reserved.</div>
        <div className="flex flex-row gap-2">
          <Link
            href="/privacy-policy"
            className="hover:text-emerald-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-service"
            className="hover:text-emerald-400 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
