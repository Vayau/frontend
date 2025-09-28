// frontend/lib/api.ts
export interface Summary {
  document_id: string;
  title?: string;
  summary_text: string;
  department_id: string;
}

export async function fetchSummaries(userId: string) {
  const res = await fetch("http://127.0.0.1:5001/summary/summaries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Fetch Error Details:", errorDetails);
    throw new Error("Failed to fetch summaries");
  }

  return res.json();
}

export async function downloadSummariesPDF(summaries: Summary[]) {
  const res = await fetch("http://127.0.0.1:5001/summary/summaries/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summaries }),
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "summaries.pdf";
  link.click();
}
