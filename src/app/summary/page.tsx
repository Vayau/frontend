"use client";
import React, { useState, useEffect } from "react";
import { Eye, X, FileText, Tag, AlertCircle } from "lucide-react";
import { useUserStore } from "@/stores/UserStore";
import { fetchSummaries, Summary } from "@/lib/api";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import axios from "axios";

// Extend Summary interface to include optional file_url and language
interface ExtendedSummary extends Summary {
  language?: string;
  file_url?: string;
  document_id: string;
  department_id: string;
}

const SummaryViewComponent: React.FC = () => {
  const { t } = useTranslation();
  const [summaries, setSummaries] = useState<ExtendedSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);

  const [selectedSummary, setSelectedSummary] =
    useState<ExtendedSummary | null>(null);
  const [translationResult, setTranslationResult] = useState<string | null>(
    null
  );
  const [translationError, setTranslationError] = useState<string | null>(null);

  const openSummaryModal = (summary: ExtendedSummary): void => {
    setSelectedSummary(summary);
    setTranslationResult(null);
    setTranslationError(null);
  };

  const closeSummaryModal = (): void => setSelectedSummary(null);

  useEffect(() => {
    const loadSummaries = async (): Promise<void> => {
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

  const translateSummary = async (text: string) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/translate/translate-summary",
        { text }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Translation API error:",
          error.response?.data || error.message
        );
        throw error.response?.data || { error: "Something went wrong" };
      } else {
        console.error("Translation API error:", error);
        throw { error: "Something went wrong" };
      }
    }
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="ml-3 text-lg font-medium text-red-800">{error}</p>
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
              {summaries.map((summary) => (
                <div
                  key={summary.document_id}
                  className="transition-all duration-700 ease-out transform cursor-pointer"
                  onClick={() => openSummaryModal(summary)}
                >
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl shadow-lg hover:scale-105 aspect-square">
                    <div className="h-full flex flex-col bg-green-100 text-black p-6">
                      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="bg-white/20 rounded-2xl p-4 mb-2">
                          <FileText className="h-10 w-10" />
                        </div>
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
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {summary.summary_text}
                        </p>
                      </div>

                      <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-xl py-3 text-sm font-semibold">
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

        {/* Modal */}
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
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Department
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedSummary.department_id}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Document ID
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedSummary.document_id}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Summary
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedSummary.summary_text}
                    </p>
                  </div>

                  {/* Translate Button */}
                  <button
                    className="w-full bg-gradient-to-r from-yellow-600 to-green-600 text-white px-6 py-2 rounded-full mt-6"
                    onClick={async () => {
                      if (selectedSummary) {
                        setTranslationError(null);
                        setTranslationResult(null);
                        try {
                          const translated = await translateSummary(
                            selectedSummary.summary_text
                          );
                          setTranslationResult(
                            typeof translated.translated_text === "string"
                              ? translated.translated_text
                              : JSON.stringify(translated.translated_text)
                          );
                        } catch (err: unknown) {
                          setTranslationError(
                            err && typeof err === "object" && "message" in err
                              ? String((err as { message: unknown }).message)
                              : "Translation failed"
                          );
                        }
                      }
                    }}
                  >
                    {t("landnavbar.menu.translate")}
                  </button>

                  {/* View Original Document */}
                  {selectedSummary.file_url && (
                    <a
                      href={selectedSummary.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center mt-4 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      View Original Document
                    </a>
                  )}

                  {translationError && (
                    <p className="text-red-600 mt-4 font-semibold">
                      {translationError}
                    </p>
                  )}

                  {translationResult && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-900 font-medium">
                        Malayalam Translation:
                      </p>
                      <p className="mt-2 text-lg">{translationResult}</p>
                    </div>
                  )}
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
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
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
        `}</style>
      </div>
    </>
  );
};

export default SummaryViewComponent;
