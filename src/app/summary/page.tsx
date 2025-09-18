"use client";
import React, { useState } from "react";
import { Eye, X, FileText, Calendar, User, Tag } from "lucide-react";

const SummaryViewComponent = () => {
  const [showSummary, setShowSummary] = useState(true);

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  const summaryData = {
    title: "Summary",

    content: {
      overview:
        "This comprehensive analysis covers the key findings from our recent market research initiative, highlighting emerging trends and opportunities in the technology sector.",

      conclusion:
        "The data suggests strong market opportunities in the sustainable technology space, with particular emphasis on remote-work enabling solutions.",
    },
  };

  return (
    <div className="relative p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
       

        <div
          className={`transition-all duration-500 ease-out transform ${
            showSummary
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative bg-gradient-to-r from-green-600 to-yellow-700 text-white p-6">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-2xl ">{summaryData.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {summaryData.content.overview}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex space-x-4">
                  <button className="hover:text-yellow-600 transition-colors duration-200">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSummary && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 -z-10"
            onClick={toggleSummary}
          />
        )}
      </div>

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
