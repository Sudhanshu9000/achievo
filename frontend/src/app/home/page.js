

import Image from "next/image";
import LandingPage from "../components/home/landingPage";
import Hero from "../components/home/hero";
import Features from "../components/home/features";
import Footer from "../components/home/footer";
export default function MainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingPage />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}