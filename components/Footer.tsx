// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sky-blue-50 py-8 text-center text-gray-600 text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Caption-AI. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy" className="hover:underline text-sky-blue-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline text-sky-blue-700">
            Terms of Service
          </Link>
          {/* Add social media links or other relevant links */}
        </div>
      </div>
    </footer>
  );
}
