// components/Navbar.tsx
import Link from "next/link";
import { Button } from "./ui/Button"; // Assuming you have a Button component

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-blue-50 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-3xl font-extrabold text-sky-blue-700">
          Caption-AI
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/get-started" passHref>
            <Button
              variant="ghost"
              size="lg"
              className="text-sky-blue-700 hover:text-sky-blue-800"
            >
              Get Started
            </Button>
          </Link>
          {/* Add more nav links here, e.g., <Link href="/features">Features</Link> */}
        </div>
      </div>
    </nav>
  );
}
