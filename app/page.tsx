// app/page.tsx
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer"; // Assuming you'll create a Footer component

export default function HomePage() {
  return (
    <>
      <Navbar /> {/* Global Navbar */}
      <main>
        <HeroSection />
        {/* You can add more sections here, e.g., Features, Testimonials, How It Works */}
        {/* <section className="py-20 bg-white">...</section> */}
      </main>
      <Footer /> {/* Global Footer */}
    </>
  );
}
