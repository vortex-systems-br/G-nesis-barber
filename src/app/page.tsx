import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
// Removemos o antigo import do Hero
// import Hero from "@/components/Hero"; 
import HeroScroll from "@/components/HeroScroll"; // Importamos o novo
import ServiceMenu from "@/components/ServiceMenu";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <SplashScreen />
      <Header />
      <main className="flex-1">
        {/* A nova experiência controlada por scroll entra aqui */}
        <HeroScroll /> 
        
        <ServiceMenu />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}