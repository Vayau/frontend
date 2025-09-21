"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import {
  Search,

  Download,
  Eye,
  MoreVertical,
  Grid,
  List,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import RagUI from "@/components/rag";

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: "documents.project_proposal",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2 hours ago",
    category: "filter.categories.projects",
    status: "Active",
    priority: "High",
  },
  {
    id: 2,
    name: "documents.safety_report",
    type: "DOCX",
    size: "1.8 MB",
    lastModified: "1 day ago",
    category: "filter.categories.reports",
    status: "Under Review",
    priority: "Medium",
  },
  {
    id: 3,
    name: "documents.budget_analysis",
    type: "XLSX",
    size: "3.2 MB",
    lastModified: "3 days ago",
    category: "filter.categories.finance",
    status: "Approved",
    priority: "High",
  },
];

const categories = [
  "All",
  "Projects",
  "Reports",
  "Finance",
  "Environmental",
  "HR",
  "Technical",
];

const Dashboard = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: unknown) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "DOCX":
        return "📝";
      case "XLSX":
        return "📊";
      default:
        return "📄";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

        <div
          className={` -mt-6 mb-6 transform transition-all duration-700 delay-300 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div
                  className={`mb-4 transform transition-all duration-700 ${
                    isLoaded
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {t("dashboard.title")}
                  </h1>
                  <p className="text-slate-600">{t("dashboard.subtitle")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transform transition-all duration-700 delay-500 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group animate-fadeInUp`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {t(doc.name)}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {doc.size} • {doc.lastModified}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {t(doc.category)}
                    </span>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/summary">
                        <button className="group relative p-3 hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-blue-200 bg-white">
                          <Eye className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        </button>
                      </Link>
                      <button className="p-1 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">
                        {t("table.document")}
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900">
                        {t("table.category")}
                      </th>

                      <th className="text-left py-4 px-6 font-semibold text-slate-900">
                        {t("table.modified")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors animate-fadeInUp`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">
                              {getFileIcon(doc.type)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {doc.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {doc.category}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-600">
                          {doc.lastModified}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div>
          <RagUI />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
