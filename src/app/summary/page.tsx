"use client";
import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { FileText } from "lucide-react";

const SummaryViewComponent = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
=======
import {
  Eye,
  X,
  FileText,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useUserStore } from "@/stores/UserStore";
import { fetchSummaries, Summary } from "@/lib/api";

const SummaryViewComponent = () => {
  const [showSummary, setShowSummary] = useState(true);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userId);
>>>>>>> Stashed changes

  const userId = "123";

  useEffect(() => {
<<<<<<< Updated upstream
    const fetchSummaries = async () => {
      try {
        const res = await fetch("http://localhost:5001/summaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!res.ok) throw new Error("Failed to fetch summaries");

        const data = await res.json();
        setSummaries(data.summaries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading summaries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="relative p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {summaries.length === 0 ? (
          <div className="text-center text-gray-600">
            No summaries available for this user.
          </div>
        ) : (
          summaries.map((summary, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-yellow-700 text-white p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-2xl font-semibold">
                    {"Untitled Document"}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {}
                </p>
                <p className="text-sm text-gray-500">
                  Department ID: <span className="font-medium">{}</span>
                </p>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <button className="hover:text-yellow-600 transition-colors duration-200">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))
=======
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

  return (
    <div className="relative p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Summaries
          </h1>
          <p className="text-gray-600">
            View and manage your document summaries
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading summaries...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && summaries.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No summaries found
            </h3>
            <p className="text-gray-600">
              You don't have any document summaries yet.
            </p>
          </div>
        )}

        {!loading && !error && summaries.length > 0 && (
          <div className="space-y-6">
            {summaries.map((summary, index) => (
              <div
                key={summary.document_id}
                className={`transition-all duration-500 ease-out transform ${
                  showSummary
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="relative bg-gradient-to-r from-green-600 to-yellow-700 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6" />
                        <h2 className="text-xl font-semibold">
                          {summary.title ||
                            `Document ${summary.document_id.slice(0, 8)}`}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Tag className="h-4 w-4" />
                        <span>Dept: {summary.department_id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="animate-fade-in-up">
                      <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {summary.summary_text}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Document ID: {summary.document_id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex space-x-4">
                        <button className="hover:text-blue-600 transition-colors duration-200">
                          View Details
                        </button>
                        <button className="hover:text-green-600 transition-colors duration-200">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
>>>>>>> Stashed changes
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SummaryViewComponent;
