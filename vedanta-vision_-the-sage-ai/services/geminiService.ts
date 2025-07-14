import { GoogleGenAI, Chat } from "@google/genai";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from '../constants';
import AnalyticsService from './analyticsService';

// In a production environment, these keys should be loaded from environment variables.
// For this example environment without a build process, we use placeholders.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "your-gemini-api-key-here";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "your-groq-api-key-here";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "your-openrouter-api-key-here";

const isGeminiKeyValid = GEMINI_API_KEY && GEMINI_API_KEY.startsWith("AIza") && !GEMINI_API_KEY.includes("REPLACE_WITH_YOUR_GEMINI_API_KEY");
const isGroqKeyValid = GROQ_API_KEY && GROQ_API_KEY.startsWith("gsk_") && !GROQ_API_KEY.includes("REPLACE_WITH_YOUR_GROQ_API_KEY");
const isOpenRouterKeyValid = OPENROUTER_API_KEY && OPENROUTER_API_KEY.startsWith("sk-or-") && !OPENROUTER_API_KEY.includes("REPLACE_WITH_YOUR_OPENROUTER_API_KEY");

const geminiAI = isGeminiKeyValid ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
// Note: dangerouslyAllowBrowser is used for development/demo purposes
// In production, API calls should be made from a secure backend server
const groqAI = isGroqKeyValid ? new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
}) : null;

const openRouterAI = isOpenRouterKeyValid ? new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true
}) : null;

function ensureConfigured(): void {
  if (!geminiAI && !groqAI && !openRouterAI) {
    throw new Error("No valid API keys configured. Please configure at least one:\n1. Gemini API key from https://aistudio.google.com/\n2. Groq API key from https://console.groq.com/\n3. OpenRouter API key from https://openrouter.ai/");
  }
}

// Define a unified chat interface
interface UnifiedChat {
  provider: 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'together';
  geminiChat?: Chat;
  messages?: Array<{ role: string; content: string }>;
}

export function createChatSession(): UnifiedChat {
  ensureConfigured();

  // Try Gemini first
  if (geminiAI) {
    try {
      const chat = geminiAI.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
      console.log("✅ Using Gemini API as primary");
      return { provider: 'gemini', geminiChat: chat };
    } catch (error) {
      console.warn("Gemini initialization failed, falling back:", error);
    }
  }

  // Fallback to Groq
  if (groqAI) {
    console.log("Using Groq API as fallback");
    return {
      provider: 'groq',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }]
    };
  }

  // Final fallback to OpenRouter
  if (openRouterAI) {
    console.log("Using OpenRouter API as final fallback");
    return {
      provider: 'openrouter',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }]
    };
  }

  throw new Error("No working API available");
}

export async function sendMessageStream(
  chat: UnifiedChat,
  message: string,
  userId?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  ensureConfigured();

  const analytics = AnalyticsService.getInstance();

  if (chat.provider === 'gemini' && chat.geminiChat) {
    try {
      const result = await chat.geminiChat.sendMessageStream({ message });

      // Track successful Gemini usage
      analytics.trackAPIUsage('gemini');
      if (userId) analytics.trackMessage(userId, 'gemini');

      async function* geminiStreamGenerator(): AsyncGenerator<string, void, unknown> {
        for await (const chunk of result) {
          const text = chunk.text;
          if (text) {
            yield text;
          }
        }
      }

      return geminiStreamGenerator();
    } catch (error) {
      console.warn("Gemini request failed, falling back:", error);
      // Fall back to other APIs
      return sendFallbackMessage(chat, message, userId);
    }
  }

  // Use fallback APIs
  return sendFallbackMessage(chat, message, userId);
}

async function sendFallbackMessage(
  chat: UnifiedChat,
  message: string,
  userId?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  // Try Groq first
  if (chat.provider === 'groq' || groqAI) {
    try {
      return await sendGroqMessage(chat, message, userId);
    } catch (error) {
      console.warn("Groq API failed, trying OpenRouter:", error);
    }
  }

  // Try OpenRouter as final fallback
  if (openRouterAI) {
    try {
      return await sendOpenRouterMessage(chat, message, userId);
    } catch (error) {
      console.error("OpenRouter API failed:", error);
    }
  }

  throw new Error("All APIs failed. Please check your API keys and try again.");
}

async function sendGroqMessage(
  chat: UnifiedChat,
  message: string,
  userId?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  if (!groqAI) {
    throw new Error("Groq API not available");
  }

  const analytics = AnalyticsService.getInstance();

  // Add user message to conversation history
  if (!chat.messages) {
    chat.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  }
  chat.messages.push({ role: 'user', content: message });

  const completion = await groqAI.chat.completions.create({
    messages: chat.messages as any,
    model: "llama-3.1-8b-instant", // Updated to current available model
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  });

  // Track successful Groq usage
  analytics.trackAPIUsage('groq');
  if (userId) analytics.trackMessage(userId, 'groq');

  async function* groqStreamGenerator(): AsyncGenerator<string, void, unknown> {
    let assistantMessage = '';
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        assistantMessage += content;
        yield content;
      }
    }
    // Add assistant response to conversation history
    if (assistantMessage && chat.messages) {
      chat.messages.push({ role: 'assistant', content: assistantMessage });
    }
  }

  return groqStreamGenerator();
}

async function sendOpenRouterMessage(
  chat: UnifiedChat,
  message: string,
  userId?: string
): Promise<AsyncGenerator<string, void, unknown>> {
  if (!openRouterAI) {
    throw new Error("OpenRouter API not available");
  }

  const analytics = AnalyticsService.getInstance();

  // Add user message to conversation history
  if (!chat.messages) {
    chat.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  }
  chat.messages.push({ role: 'user', content: message });

  const completion = await openRouterAI.chat.completions.create({
    messages: chat.messages as any,
    model: "deepseek/deepseek-chat", // Good free model on OpenRouter
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  });

  // Track successful OpenRouter usage
  analytics.trackAPIUsage('openrouter');
  if (userId) analytics.trackMessage(userId, 'openrouter');

  async function* openRouterStreamGenerator(): AsyncGenerator<string, void, unknown> {
    let assistantMessage = '';
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        assistantMessage += content;
        yield content;
      }
    }
    // Add assistant response to conversation history
    if (assistantMessage && chat.messages) {
      chat.messages.push({ role: 'assistant', content: assistantMessage });
    }
  }

  return openRouterStreamGenerator();
}
