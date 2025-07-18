"use client"; // This page needs to be a client component for animations

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HeroPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Replicate Caption Styles Instantly
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Paste a link to any Instagram Reel and upload your landscape video. We
          will handle the rest, giving you movable, editable captions in
          seconds.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
      >
        <Button
          asChild
          className="mt-10 px-8 py-6 text-lg font-semibold"
          size="lg"
        >
          <Link href="/get-started">
            Get Started <MoveRight className="ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
