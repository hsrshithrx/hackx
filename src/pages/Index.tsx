import { useState } from "react";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";
import ReportAnalyzer from "@/components/ReportAnalyzer";
import AppointmentBooking from "@/components/AppointmentBooking";
import HealthArticles from "@/components/HealthArticles";
import DietPlanner from "@/components/DietPlanner";

type Section = 'hero' | 'chat' | 'reports' | 'appointments' | 'articles' | 'diet';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('hero');

  const handleNavigate = (section: Section) => {
    setCurrentSection(section);
  };

  const handleBack = () => {
    setCurrentSection('hero');
  };

  return (
    <>
      {currentSection === 'hero' && <Hero onNavigate={handleNavigate} />}
      {currentSection === 'chat' && <ChatInterface onBack={handleBack} />}
      {currentSection === 'reports' && <ReportAnalyzer onBack={handleBack} />}
      {currentSection === 'appointments' && <AppointmentBooking onBack={handleBack} />}
      {currentSection === 'articles' && <HealthArticles onBack={handleBack} />}
      {currentSection === 'diet' && <DietPlanner onBack={handleBack} />}
    </>
  );
};

export default Index;
