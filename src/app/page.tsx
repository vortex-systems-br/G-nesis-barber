import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceMenu from "@/components/ServiceMenu";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceMenu />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}
