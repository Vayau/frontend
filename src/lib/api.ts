import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5001";

export interface Summary {
  document_id: string;
  title: string | null;
  summary_text: string;
  department_id: string;
}

export interface SummariesResponse {
  summaries: Summary[];
}

export const fetchSummaries = async (
  userId: string
): Promise<SummariesResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/summary/summaries`, {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching summaries:", error);
    throw error;
  }
};
