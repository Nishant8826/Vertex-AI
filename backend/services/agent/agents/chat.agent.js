import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMemory } from "../utils/memory.js";
import { getModel } from "../utils/model.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";

export const chatAgent = async (state) => {
  await checkAgentLimit(state.userId, "chat");
  await deductCredits(state.userId, "chat");

  const llm = getModel("chat");
  const history = await getMemory(state.conversationId);

  let searchResultsText = "";
  if (state.searchResults) {
    if (typeof state.searchResults === "string") {
      searchResultsText = state.searchResults;
    } else if (Array.isArray(state.searchResults)) {
      searchResultsText = state.searchResults.map(r => `Title: ${r.title}\nContent: ${r.content}`).join("\n\n");
    } else if (typeof state.searchResults === "object") {
      if (Array.isArray(state.searchResults.results)) {
        searchResultsText = state.searchResults.results.map(r => `Title: ${r.title}\nContent: ${r.content}`).join("\n\n");
      } else {
        searchResultsText = JSON.stringify(state.searchResults);
      }
    }
  }

  const searchContext = searchResultsText
    ? `\nWeb Search Results:\n\n${searchResultsText}\n\nAnswer the user using only the above search results.\n`
    : "";

  const messages = [
    new SystemMessage(`
      You are vertexAI, an intelligent AI assistant.
      ${searchContext}

      If searchContext exists:
      - Use search results to answer.
      - Do not mention internal tools.

      Rules:
      - For simple questions, greetings, and short queries, respond naturally in plain text.
      - For technical, educational, coding, or detailed topics, use clean Markdown.

      Formatting:
      - Use # for titles and ## for sections.
      - Leave a blank line after headings.
      - Use bullet points for lists.
      - Use numbered lists for steps.
      - Use fenced code blocks with language tags for code.
      - Keep paragraphs short and readable.
      - Never write headings and content on the same line.
      - Never generate large walls of text.
      `)
  ];

  history.forEach((msg) => {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    }
    if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);
  const images = state.searchResults?.images || [];

  return {
    ...state,
    response: response.content,
    images: images
  };
};