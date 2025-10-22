import { geminiClient } from "../config/geminiClient.js";
import { getExpenseData } from "../utils/expenseHelper.js";
import Expense from "../models/expense.js";
import mongoose from "mongoose";

// ===============================
// 📊 getSuggestions (Weekly Summary)
// ===============================
export const getSuggestions = async (req, res) => {
  try {
    const data = await getExpenseData(req.userId);

    const systemPrompt = `
You are a concise financial dashboard assistant. 
Always return **only valid JSON**, no markdown, no explanations.
Follow schema exactly.
    `;

    const userPrompt = `
The user’s last 7 days expense data:
${JSON.stringify(data, null, 2)}

Now return an object matching this schema:
{
  "headline": string,
  "total": number,
  "currency": string,
  "trend": "up" | "down" | "flat",
  "pct_change": number,
  "topPaymentMethodUsed": { "name": string, "amount": number, "pct": number },
  "peakDay": { "date": "YYYY-MM-DD", "amount": number },
  "chart": { "type": "sparkline", "series": [number,...], "labels": ["YYYY-MM-DD", ...] },
  "paymentMethodBreakdown": [ { "method": string, "amount": number } ],
  "recentTransactions": [ { "id": string, "title": string, "description": string, "amount": number, "date": "YYYY-MM-DD", "paymentmethod": string } ],
  "action": { "label": string, "url": string, "tip": string },
  "severity": "ok" | "caution" | "alert"
}
`;

    const responseText = await geminiClient.generate({
      prompt: userPrompt,
      systemPrompt,
    });

    // Try to extract JSON
    const jsonMatch = responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("Gemini did not return JSON");

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    console.error("Error in getSuggestions:", error);
    res.status(500).json({ error: "AI suggestion failed" });
  }
};

// ===============================
// 💬 chatWithAi
// ===============================
export const chatWithAi = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "query is required" });

    const systemPrompt = `
You are an expense management AI assistant.
Always respond ONLY in valid JSON (no markdown, no explanations).

Output Schema:
{
  "operation": "add_expense" | "list_expense" | "unknown",
  "expense_data": { ... } // when add_expense
  "pipeline": [ ... ],     // when list_expense
  "metadata": { "explain": string },
  "advisor_message": string
}
    `;

    const responseText = await geminiClient.generate({
      prompt: query,
      systemPrompt,
    });

    console.log("Gemini raw:", responseText);

    const jsonMatch = responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("Invalid JSON");
    const responseObj = JSON.parse(jsonMatch[0]);

    if (!responseObj?.operation)
      return res.status(200).json({ message: "Unrecognized query" });

    // Handle add_expense
    if (responseObj.operation === "add_expense") {
      const exp = responseObj.expense_data;
      if (!exp?.rs)
        return res.status(200).json({ message: "Please include amount" });

      await Expense.create({
        title: exp.title,
        description: exp.description,
        rs: exp.rs,
        paymentMethod: exp.paymentMethod,
        userId: req.userId,
        hidden: false,
        createdAt: exp.createdAt || new Date(),
      });

      return res.status(200).json({
        operation: "add_expense",
        message: "🎉 Expense added successfully!",
      });
    }

    // Handle list_expense
    if (responseObj.operation === "list_expense") {
      let pipeline = responseObj.pipeline || [];
      pipeline = injectUserMatch(pipeline, req.userId);
      pipeline = normalizePipeline(pipeline);

      const result = await Expense.aggregate(pipeline).exec();
      return res.status(200).json({
        operation: "list_expense",
        result,
        message: responseObj.metadata?.explain,
      });
    }

    // Handle unknown
    res.status(200).json({
      operation: "unknown",
      message: responseObj.advisor_message || "I didn’t understand that.",
    });
  } catch (error) {
    console.error("chatWithAi error:", error);
    res.status(500).json({ error: "Chat AI failed" });
  }
};

// ===============================
// Helpers
// ===============================
function injectUserMatch(pipeline, userId) {
  const matchStage = { $match: { userId: new mongoose.Types.ObjectId(userId) } };
  if (!pipeline || pipeline.length === 0) return [matchStage];
  if (pipeline[0].$match) {
    pipeline[0].$match.userId = new mongoose.Types.ObjectId(userId);
    return pipeline;
  }
  return [matchStage, ...pipeline];
}

function normalizePipeline(pipeline) {
  if (!Array.isArray(pipeline) || pipeline.length === 0) return pipeline;
  if (!pipeline[0].$match) pipeline.unshift({ $match: {} });

  const match = pipeline[0].$match;
  if (match.createdAt && typeof match.createdAt === "object") {
    for (const op of ["$gte", "$lte", "$gt", "$lt"]) {
      if (match.createdAt[op]) {
        const val = new Date(match.createdAt[op]);
        if (!isNaN(val)) match.createdAt[op] = val;
      }
    }
  }
  return pipeline;
}
