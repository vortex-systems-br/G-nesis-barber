import SplashScreen from "@/components/SplashScreen";
import FloatingBackground from "@/components/FloatingBackground";
import { MotionToggle } from "@/components/MotionToggle";
import { BackgroundGovernor } from "@/components/BackgroundGovernor";
import Header from "@/components/Header";
import HeroScroll from "@/components/HeroScroll";
import ServiceMenu from "@/components/ServiceMenu";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    // Isolamento estrutural (isolate) para proteger o z-index negativo do fundo flutuante.
    // overflow-x-clip garante que o sticky do Hero não quebra no telemóvel.
    <div className="relative isolate min-h-[100svh] text-zinc-50 flex flex-col overflow-x-clip bg-zinc-950">
      
      {/* --- MOTOR DE FUNDO --- */}
      <FloatingBackground />
      <MotionToggle />
      <BackgroundGovernor sentinelId="after-hero" />

      {/* --- UI PRINCIPAL --- */}
      <SplashScreen />
      <Header />
      
      <main className="flex-1 w-full">
        {/* A secção cinematográfica presa ao scroll (400vh) */}
        <HeroScroll />
        
        {/* O sentinela: quando esta div entra no ecrã, o Governador "acorda" as tesouras no fundo */}
        <div id="after-hero">
          <ServiceMenu />
        </div>
        
        <InfoSection />
      </main>
      
      <Footer />
    </div>
  );
}