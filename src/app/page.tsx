"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  FileText,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Menu,
  X,
  Play,
  Star,
  ArrowDown,
  Globe,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import i18n from "@/lib/i18n";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: FileText,
      title: t("features.list.organization.title"),
      description: t("features.list.organization.description"),
      color: "blue",
    },
    {
      icon: Shield,
      title: t("features.list.security.title"),
      description: t("features.list.security.description"),
      color: "green",
    },
    {
      icon: Zap,
      title: t("features.list.search.title"),
      description: t("features.list.search.description"),
      color: "purple",
    },
    {
      icon: Users,
      title: t("features.list.collaboration.title"),
      description: t("features.list.collaboration.description"),
      color: "orange",
    },
  ];

  const FloatingElement = ({
    children,
    delay = 0,
    amplitude = 20,
  }: {
    children: React.ReactNode;
    delay?: number;
    amplitude?: number;
  }) => (
    <div
      className="animate-float"
      style={
        {
          animationDelay: `${delay}s`,
          "--amplitude": `${amplitude}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                {t("landnavbar.brand")}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {t("landnavbar.menu.features")}
              </a>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="rounded border px-2 py-1 text-sm text-pink-700"
              >
                <option value="en">English</option>
                <option value="ml">മലയാളം</option>
              </select>
              <Link href="/login">
                <button className="bg-gradient-to-r from-yellow-600 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  {t("landnavbar.menu.getStarted")}
                </button>
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {t("landnavbar.menu.features")}
              </a>

              <a
                href="#about"
                className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {t("landnavbar.menu.language")}
              </a>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-green-600 text-white px-6 py-2 rounded-full">
                {t("landnavbar.menu.getStarted")}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-yellow-50 to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElement delay={0} amplitude={30}>
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          </FloatingElement>
          <FloatingElement delay={2} amplitude={25}>
            <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          </FloatingElement>
          <FloatingElement delay={1} amplitude={35}>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          </FloatingElement>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="group bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>{t("hero.watchDemo")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("features.heading")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold">{t("footer.brand")}</span>
              </div>
              <p className="text-gray-400">{t("footer.tagline")}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                {t("footer.company.title")}
              </h3>
              <ul className="space-y-2">
                {(() => {
                  const links = t("footer.company.links", {
                    returnObjects: true,
                  });
                  return (Array.isArray(links) ? links : []).map(
                    (link: string) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    )
                  );
                })()}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                {t("footer.support.title")}
              </h3>
              <ul className="space-y-2">
                {(() => {
                  const links = t("footer.support.links", {
                    returnObjects: true,
                  });
                  return (Array.isArray(links) ? links : []).map(
                    (link: string) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    )
                  );
                })()}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--amplitude, -20px));
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
