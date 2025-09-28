"use client";
import React, { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  text: string | object;
  sender: "user" | "bot";
  timestamp: Date;
};

type FileOption = {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
};

const askQuestion = async (question: string, selectedFile?: string) => {
  const res = await fetch("http://localhost:5001/rag/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, selectedFile }),
  });
  return res.json();
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export default function RagUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFileSelection, setShowFileSelection] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // File options that users can choose from
  const fileOptions: FileOption[] = [
    {
      id: "policy_manual",
      name: "Finance Document",
      description: "Documents containing budgets",
      endpoint: "/rag/policy",
    },
    {
      id: "technical_docs",
      name: "HR Document",
      description: "Documents for guidelines to HR and salary",

      endpoint: "/rag/technical",
    },
    {
      id: "faq_database",
      name: "Operations Document",
      description: "Guidelines and principles to be followed by metro",

      endpoint: "/rag/faq",
    },
    {
      id: "custom_upload",
      name: "Upload Custom File",
      description: "Upload your own document",

      endpoint: "/rag/custom",
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Reset file selection when chat is opened
    if (isOpen && messages.length === 0) {
      setShowFileSelection(true);
      setSelectedFile(null);
    }
  }, [isOpen, messages.length]);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  const addMessage = (text: string | object, sender: "user" | "bot") => {
    const message: Message = {
      id: generateId(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  };

  const handleFileOptionSelect = (option: FileOption) => {
    if (option.id === "custom_upload") {
      // Trigger file upload for custom files
      fileInputRef.current?.click();
    } else {
      setSelectedFile(option);
      setShowFileSelection(false);
      addMessage(`Selected: ${option.name} - ${option.description}`, "user");
      addMessage(
        `Great! I'm now ready to answer questions about the ${option.name.toLowerCase()}. What would you like to know?`,
        "bot"
      );
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!selectedFile && !showFileSelection) {
      addMessage("Please select a file source first to get started.", "bot");
      setShowFileSelection(true);
      return;
    }

    const userMessage = addMessage(inputValue, "user");
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await askQuestion(
        userMessage.text as string,
        selectedFile?.id
      );
      addMessage(
        typeof data.answer === "string"
          ? data.answer
          : JSON.stringify(data.answer),
        "bot"
      );
    } catch {
      addMessage("⚠️ Error connecting to server.", "bot");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const customFileOption: FileOption = {
      id: "custom_uploaded",
      name: file.name,
      description: `Uploaded file: ${file.name}`,
    };

    setSelectedFile(customFileOption);
    setShowFileSelection(false);
    addMessage(`📄 Uploaded: ${file.name}`, "user");
    setIsTyping(true);

    try {
      const content = await file.text();
      addMessage(
        `File uploaded successfully! I can now answer questions about the content of "${file.name}". What would you like to know?`,
        "bot"
      );
      // Here you would typically send the file content to your backend
    } catch (error) {
      addMessage("❌ Error reading the file. Please try again.", "bot");
    } finally {
      setIsTyping(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetChat = () => {
    setMessages([]);
    setSelectedFile(null);
    setShowFileSelection(true);
    setInputValue("");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-yellow-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-pulse"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Knowledge Assistant</span>
              {selectedFile && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {selectedFile.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {selectedFile && (
                <button
                  onClick={resetChat}
                  className="text-white hover:bg-white/20 p-1 rounded transition-all"
                  title="Reset Chat"
                >
                  🔄
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition-all"
              >
                ✖
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-96">
            {/* File Selection Interface */}
            {showFileSelection && messages.length === 0 && (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-yellow-100 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      👋 Welcome! Choose a knowledge source:
                    </h3>
                    <p className="text-sm text-gray-600">
                      Select which documents you would like to ask questions
                      about
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {fileOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleFileOptionSelect(option)}
                      className="p-3 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-left group hover:scale-105"
                    >
                      <div className="font-medium text-sm text-gray-800">
                        {option.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 max-w-xs text-sm shadow-md transition-all hover:shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none"
                      : "bg-gray-50 text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p>
                    {typeof msg.text === "string"
                      ? msg.text
                      : JSON.stringify(msg.text)}
                  </p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      msg.sender === "user" ? "text-green-100" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-800 px-3 py-2 rounded-2xl text-sm shadow-md border border-gray-200">
                  <div className="flex items-center space-x-1">
                    <span>Gathering Info</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center border-t border-gray-200 p-2 bg-gray-50">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
              placeholder={
                selectedFile
                  ? "Ask a question..."
                  : "Select a file source first..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!selectedFile && !showFileSelection}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedFile && !showFileSelection}
              className="ml-2 bg-gradient-to-r from-green-600 to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-full text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              Send
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.pdf,.docx"
              hidden
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out both;
        }
      `}</style>
    </>
  );
}
