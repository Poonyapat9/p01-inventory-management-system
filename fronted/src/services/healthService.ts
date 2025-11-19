import axios from "axios";

export const healthService = {
  async checkHealth(): Promise<boolean> {
    try {
      // Use direct axios to avoid interceptors and baseURL issues
      const response = await axios.get(
        "https://stockme-backend.vercel.app/health",
        {
          timeout: 5000,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  },
};
