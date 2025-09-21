"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  X,
  FileText,
  Tag,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { useUserStore } from "@/stores/UserStore";
import { fetchSummaries, Summary } from "@/lib/api";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

const SummaryViewComponent = () => {
  const { t } = useTranslation();
  const [showSummary, setShowSummary] = useState(true);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    const loadSummaries = async () => {
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchSummaries(userId);
        setSummaries(response.summaries);
      } catch (err) {
        console.error("Error loading summaries:", err);
        setError("Failed to load summaries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSummaries();
  }, [userId]);

  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  const openSummaryModal = (summary: Summary): void => {
    setSelectedSummary(summary);
  };

  const closeSummaryModal = (): void => {
    setSelectedSummary(null);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  {t("navbar.welcome")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="relative p-8 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-200 bg-clip-text text-transparent mb-4">
              Document Summaries
            </h1>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="mt-6 text-lg text-gray-600 font-medium">
                Loading summaries...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && summaries.length === 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No summaries found
              </h3>
              <p className="text-gray-600 text-lg">
                You dont have any document summaries yet.
              </p>
            </div>
          )}

          {!loading && !error && summaries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((summary: Summary, index: number) => (
                <div
                  key={summary.document_id}
                  className={`transition-all duration-700 ease-out transform cursor-pointer ${
                    showSummary
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl shadow-lg hover:shadow-xl aspect-square hover:scale-105"
                    onClick={() => openSummaryModal(summary)}
                  >
                    <div className="h-full flex flex-col bg-green-100 text-black p-6">
                      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="bg-white/20 rounded-2xl p-4 mb-2 transition-transform duration-300 group-hover:scale-110">
                          <FileText className="h-10 w-10" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
                            {summary.title ||
                              `Document ${summary.document_id.slice(0, 8)}`}
                          </h3>
                          <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-lg px-3 py-1 mb-4">
                            <Tag className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {summary.department_id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-xl py-3 text-sm font-semibold transition-all duration-200">
                        <Eye className="h-4 w-4" />
                        <span>View Summary</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={closeSummaryModal}
            ></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
              <div className="bg-gradient-to-r from-yellow-600 via-green-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-2xl p-3">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedSummary.title ||
                          `Document ${selectedSummary.document_id.slice(0, 8)}`}
                      </h2>
                      <p className="text-white/90 mt-1">Document Summary</p>
                    </div>
                  </div>

                  <button
                    onClick={closeSummaryModal}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Department
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {selectedSummary.department_id.slice(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Document ID
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {selectedSummary.document_id.slice(0, 16)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <span>Summary</span>
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedSummary.summary_text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-500"></div>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @keyframes modal-in {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-modal-in {
            animation: modal-in 0.3s ease-out forwards;
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </>
  );
};
export default SummaryViewComponent;
