import axios from "axios";
import { GEMINI_KEY } from "../utils/constants.js";

/**
 * Base Gemini API config
 */
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * 🔹 Reusable Gemini Client
 * Usage:
 *   await geminiClient.generate({
 *     prompt: "your main message",
 *     systemPrompt: "optional system role",
 *     key: "optional override key"
 *   })
 */
export const geminiClient = {
  generate: async ({ prompt, systemPrompt = "", key = GEMINI_KEY }) => {
    try {
      // Combine system + user prompt if provided
      const finalPrompt = systemPrompt
        ? `${systemPrompt.trim()}\n\nUser Query:\n${prompt}`
        : prompt;

      // Make Gemini API call
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: finalPrompt }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": key,
          },
        }
      );

      // Extract clean text output
      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        throw new Error("No response text from Gemini");
      }

      return text;
    } catch (error) {
      console.error("Gemini API error:", error.response?.data || error.message);
      throw new Error("Gemini request failed");
    }
  },
};
