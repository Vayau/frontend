"use client";
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  DragEvent,
  FormEvent,
} from "react";
import {
  Upload,
  FileText,
  X,
  Check,
  ArrowLeft,
  File,
  Image,
  FileType,
  Globe,
  Save,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useUserStore } from "@/stores/UserStore";

interface UploadedFile extends File {
  preview?: string;
}

interface FormData {
  title: string;
  type: string;
  language: string;
  source: string;
}

interface FormErrors {
  title?: string;
  type?: string;
  language?: string;
  source?: string;
}

interface FileIconProps {
  className: string;
}

const DocumentUploadPage: React.FC = () => {
  const userId = useUserStore((state) => state.userId);
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
 
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    language: "",
    source: "official website",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: string[] = ["typed", "handwritten"];

  const languages: string[] = ["english", "malayalam", "bilingual"];

  useEffect(() => {
    if (!userId) {
      alert("You are not logged in");
      router.push("/login");
    }
  }, [userId, router]);

  useEffect(() => {
    if (uploadedFile && uploadProgress === 100) {
      const timer = setTimeout(() => {
        setShowForm(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, uploadedFile]);

  const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File): void => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const removeFile = (): void => {
    setUploadedFile(null);
    setUploadProgress(0);
    setShowForm(false);
    setFormData({ title: "", type: "", language: "", source: "" });
    setErrors({});
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Document title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.type) {
      newErrors.type = "Document type is required";
    }

    if (!formData.language) {
      newErrors.language = "Document language is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e?: FormEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (!validateForm() || !uploadedFile || !userId) return;
    if (!userId) {
      alert("User not logged in!");
      return;
    }
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId
      )
    ) {
      alert("Invalid user ID");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", uploadedFile);
    uploadFormData.append("title", formData.title);
    uploadFormData.append("type", formData.type);
    uploadFormData.append("language", formData.language);
    uploadFormData.append("source", "official website");
    uploadFormData.append("uploaded_by", userId);

    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:5001/document/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || "Upload failed. Please try again.");
        }
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        removeFile();
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (
    file: File | null
  ): React.ComponentType<FileIconProps> => {
    if (!file) return FileText;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return Image;
    } else if (["pdf"].includes(extension)) {
      return FileText;
    } else {
      return File;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleGoBack = (): void => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Upload Document - KMRL DocManager</title>
        <meta
          name="description"
          content="Upload and manage your documents securely with KMRL DocManager"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delay"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  type="button"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                    KMRL DocManager
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upload Your
              <span className="bg-gradient-to-r from-green-600 to-yellow-400 bg-clip-text text-transparent">
                {" "}
                Document
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Securely upload and organize your documents with our intelligent
              management system
            </p>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-scale-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your document has been uploaded and processed successfully.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>{formData.title}</strong> • {formData.type} •{" "}
                  {formData.language}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {!uploadedFile ? (
              <div
                className={`relative p-12 transition-all duration-300 ${
                  dragActive
                    ? "bg-blue-50 border-blue-300 scale-[1.02]"
                    : "bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-purple-50/30"
                } border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-3xl cursor-pointer group`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                />

                <div className="text-center animate-fade-in-up">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    Drop your files here
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    or{" "}
                    <span className="text-blue-600 font-semibold">browse</span>{" "}
                    to choose files
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="mb-8 animate-slide-in-up">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                            {React.createElement(getFileIcon(uploadedFile), {
                              className: "w-8 h-8 text-white",
                            })}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {uploadedFile.name}
                            </h3>
                            <p className="text-gray-600">
                              {formatFileSize(uploadedFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-2 hover:bg-red-100 rounded-full transition-colors group"
                          type="button"
                        >
                          <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                        </button>
                      </div>

                      {isUploading && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Uploading...
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {Math.round(uploadProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-500 to-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {uploadProgress === 100 && !isUploading && (
                        <div className="mt-4 flex items-center text-green-600 animate-fade-in">
                          <Check className="w-5 h-5 mr-2" />
                          <span className="font-medium">
                            Loaded successfully!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showForm && (
                  <div className="space-y-6 animate-fade-in-up-delay">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-3">
                        <label
                          htmlFor="title"
                          className="block text-sm font-bold text-gray-900 mb-2 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          Document Title *
                        </label>
                        <div className="relative">
                          <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg ${
                              errors.title
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            placeholder="Enter a descriptive title for your document"
                            maxLength={200}
                          />
                          {errors.title && (
                            <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm animate-slide-in">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.title}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor="type"
                          className="block text-sm font-bold text-gray-900 mb-2 flex items-center"
                        >
                          <FileType className="w-4 h-4 mr-2 text-purple-600" />
                          Document Type *
                        </label>
                        <div className="relative">
                          <select
                            id="type"
                            value={formData.type}
                            onChange={(e) =>
                              handleInputChange("type", e.target.value)
                            }
                            className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg appearance-none ${
                              errors.type
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            <option value="">Select document type</option>
                            {documentTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {errors.type && (
                            <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm animate-slide-in">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.type}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="language"
                          className="block text-sm font-bold text-gray-900 mb-2 flex items-center"
                        >
                          <Globe className="w-4 h-4 mr-2 text-green-600" />
                          Language *
                        </label>
                        <div className="relative">
                          <select
                            id="language"
                            value={formData.language}
                            onChange={(e) =>
                              handleInputChange("language", e.target.value)
                            }
                            className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg appearance-none ${
                              errors.language
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            <option value="">Select language</option>
                            {languages.map((language) => (
                              <option key={language} value={language}>
                                {language}
                              </option>
                            ))}
                          </select>
                          {errors.language && (
                            <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-sm animate-slide-in">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.language}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-green-600 to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex items-center justify-center space-x-2 group"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Upload Document</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float-delay {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes sparkle {
            0%,
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.1) rotate(180deg);
            }
          }

          @keyframes sparkle-delay {
            0%,
            100% {
              opacity: 0.8;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.3;
              transform: scale(1.2) rotate(-180deg);
            }
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

          @keyframes fade-in-up-delay {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-up {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float-delay 7s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-sparkle {
            animation: sparkle 3s ease-in-out infinite;
          }
          .animate-sparkle-delay {
            animation: sparkle-delay 4s ease-in-out infinite;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          .animate-fade-in-up-delay {
            animation: fade-in-up-delay 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }
          .animate-slide-in-up {
            animation: slide-in-up 0.6s ease-out forwards;
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          .animate-scale-in {
            animation: scale-in 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default DocumentUploadPage;
