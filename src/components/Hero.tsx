import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  Calendar,
  BookOpen,
  ChefHat,
} from "lucide-react";
import { motion } from "framer-motion";
import FreeHealthcareMap from './FreeHealthcareMap';

interface HeroProps {
  onNavigate: (
    section: "chat" | "reports" | "appointments" | "articles" | "diet"
  ) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <div className="relative bg-white text-gray-800">
      {/* Main Content Container */}
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="w-full flex justify-between items-center py-6 px-6 md:px-16 lg:px-24 border-b border-gray-200">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="VEEVA Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              VEEVA
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex gap-10 text-sm font-medium text-gray-500 uppercase tracking-wide">
            <button className="hover:text-gray-900">Main</button>
            <button className="hover:text-gray-900">Features</button>
            <button className="hover:text-gray-900">About</button>
            <button className="hover:text-gray-900">Contact</button>
          </nav>
        </header>

        {/* Main Content - Takes up remaining space */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 lg:px-24">
          {/* Hero Content */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Left Text Section */}
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                VEEVA
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                An AI-powered health companion that understands your needs — helping
                you track wellness, plan balanced diets, analyze reports, and stay
                on top of your fitness journey with ease and precision.
              </p>
              <Button
                onClick={() => onNavigate("chat")}
                className="bg-gray-900 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-sm uppercase tracking-wider"
              >
                Explore AI →
              </Button>
            </div>

            {/* Right Image Section */}
            <motion.div
              className="lg:w-1/2 rounded-3xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <img
                src="/hero-image.png"
                alt="VEEVA Health AI"
                className="w-full object-cover rounded-3xl"
              />
            </motion.div>
          </motion.div>

          {/* Feature Section */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-24 w-full max-w-6xl mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              {
                icon: MessageSquare,
                title: "AI Chat",
                desc: "Converse with your digital health guide",
                nav: "chat",
              },
              {
                icon: ChefHat,
                title: "Diet Planner",
                desc: "Personalized meal and nutrition tracking",
                nav: "diet",
              },
              {
                icon: FileText,
                title: "Smart Reports",
                desc: "Visual insights from your medical data",
                nav: "reports",
              },
              {
                icon: Calendar,
                title: "Appointments",
                desc: "Seamless health scheduling",
                nav: "appointments",
              },
              {
                icon: BookOpen,
                title: "Wellness Articles",
                desc: "Curated knowledge for better living",
                nav: "articles",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onNavigate(item.nav as any)}
              >
                <item.icon className="w-8 h-8 text-gray-900 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </main>
      </div>

      {/* Healthcare Map Section - Separate from main content */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <FreeHealthcareMap />
      </motion.section>

      {/* Footer - At the very bottom */}
      <footer className="w-full border-t border-gray-200 py-8 px-6 md:px-16 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="VEEVA Logo"
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-semibold text-gray-900">VEEVA</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your AI-powered health companion for a healthier, happier life.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => onNavigate("chat")} className="hover:text-gray-900">AI Health Chat</button></li>
                <li><button onClick={() => onNavigate("diet")} className="hover:text-gray-900">Diet Planning</button></li>
                <li><button onClick={() => onNavigate("reports")} className="hover:text-gray-900">Report Analysis</button></li>
                <li><button onClick={() => onNavigate("appointments")} className="hover:text-gray-900">Appointments</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => onNavigate("articles")} className="hover:text-gray-900">Health Articles</button></li>
                <li><button className="hover:text-gray-900">Find Healthcare</button></li>
                <li><button className="hover:text-gray-900">Help Center</button></li>
                <li><button className="hover:text-gray-900">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button className="hover:text-gray-900">Support</button></li>
                <li><button className="hover:text-gray-900">Feedback</button></li>
                <li><button className="hover:text-gray-900">Community</button></li>
                <li><button className="hover:text-gray-900">Updates</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 VEEVA — AI Health Companion. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <button className="text-sm text-gray-400 hover:text-gray-600">Terms</button>
              <button className="text-sm text-gray-400 hover:text-gray-600">Privacy</button>
              <button className="text-sm text-gray-400 hover:text-gray-600">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
