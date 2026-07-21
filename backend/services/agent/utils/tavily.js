import { TavilySearch } from "@langchain/tavily";

/**
 * 🔍 TAVILY SEARCH TOOL
 * 
 * 💡 WHAT IS TAVILY?
 * Tavily is a search engine optimized specifically for LLMs and autonomous AI agents.
 * Unlike standard web search APIs (like Google or Bing) that return raw search results 
 * intended for human reading, Tavily aggregates, filters, and extracts the most relevant 
 * information from multiple sources and formats it directly for LLM context windows.
 * 
 * ❓ WHY DO WE USE IT?
 * 1. Time & Cost Efficient: It cleans, extracts, and summarizes web page contents so 
 *    the agent doesn't waste tokens parsing raw HTML or irrelevant ads.
 * 2. Visual Content Support: It natively extracts and returns related images matching 
 *    the query (which we present inline to the user).
 * 3. Freshness: It allows the agent to break out of its knowledge cutoff date to answer 
 *    questions about current events and real-time news.
 * 
 * 🛠️ HOW DOES IT WORK?
 * We initialize the `TavilySearch` class from `@langchain/tavily` with configuration options:
 * - `maxResults: 5`: We request the top 5 most relevant results.
 * - `topic: "general"`: General search topic.
 * - `includeImages: true`: We ask Tavily to gather and return relevant images matching the query.
 * 
 * 🚀 IMPACT ON VERTEX-AI
 * When a user enters a query that needs real-time knowledge (e.g., "latest stock price" or 
 * "news about Space X"), the Router node directs the flow to `search.agent.js`. This search agent 
 * invokes `searchTool` here, receives fresh textual data and images, and feeds them into the 
 * chat agent's context. The Chat Agent can then synthesize a factual, up-to-date response.
 */
export const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true
});
