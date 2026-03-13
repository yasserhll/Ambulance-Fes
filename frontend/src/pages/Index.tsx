import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import CoverageSection from "@/components/landing/CoverageSection";
import CollaboratorsSection from "@/components/landing/CollaboratorsSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <CoverageSection />
      <CollaboratorsSection />
      <Footer />
    </div>
  );
};

export default Index;
