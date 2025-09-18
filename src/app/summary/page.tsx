"use client";
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

const SummaryViewComponent = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "123";

  useEffect(() => {
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
