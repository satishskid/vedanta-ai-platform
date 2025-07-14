import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { type Message, Role } from './types';
import { COURSE_STRUCTURE, FREE_TIER_MESSAGE_LIMIT } from './constants';
import { createChatSession, sendMessageStream } from './services/geminiService';
import AnalyticsService from './services/analyticsService';

import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import JourneyMapModal from './components/JourneyMapModal';

import AdminDashboard from './components/AdminDashboard';
import APIHealthIndicator from './components/APIHealthIndicator';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SupportPage from './components/SupportPage';

import { MapIcon, StarIcon } from './components/Icons';

// Define the UnifiedChat interface locally to match the service
interface UnifiedChat {
  provider: 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'together';
  geminiChat?: any;
  messages?: Array<{ role: string; content: string }>;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatSession, setChatSession] = useState<UnifiedChat | null>(null);

  // Clerk authentication hooks
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isAuthenticated = !!isSignedIn;
  const isPaidSubscriber = user?.publicMetadata?.isPaidSubscriber === true;

  // Debug authentication state
  console.log("🔐 Auth Debug:", { isSignedIn, isAuthenticated, user: user?.id, isPaidSubscriber });

  // Track user session for analytics
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const analytics = AnalyticsService.getInstance();
      analytics.trackUserSession(user.id);
    }
  }, [isAuthenticated, user?.id]);

  // State for daily message limit for free users
  const [dailyMessageCount, setDailyMessageCount] = useState<number>(0);

  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isJourneyMapOpen, setIsJourneyMapOpen] = useState(false);

  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'privacy' | 'terms' | 'support'>('main');


  // Check if user is admin - restrict to specific authorized users only
  const isAdmin = user?.publicMetadata?.isAdmin === true ||
                  user?.emailAddresses?.[0]?.emailAddress === 'dr.satish@greybrain.ai' ||
                  user?.emailAddresses?.[0]?.emailAddress === 'balwant@greybrain.ai';

  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("🚀 Initializing chat session...");

      const chat = createChatSession();
      console.log("✅ Chat session created:", chat.provider);
      setChatSession(chat);

      console.log("📤 Sending introduction message...");
      const stream = await sendMessageStream(chat, "Please provide your full introduction, explaining what this platform offers and its purpose.", user?.id);

      const initialMessageId = `model-${Date.now()}`;
      setMessages([{ id: initialMessageId, role: Role.MODEL, text: '' }]);

      console.log("📥 Receiving streamed response...");
      for await (const chunk of stream) {
        setMessages(prev => prev.map(m => m.id === initialMessageId ? {...m, text: m.text + chunk} : m));
      }

      console.log("✅ Chat initialization complete!");

    } catch (error) {
      console.error("❌ Initialization failed:", error);
      setMessages([{
        id: `error-${Date.now()}`,
        role: Role.MODEL,
        text: `Welcome to Vedanta Vision: The Sage AI! 🙏

I'm Professor Arya, your guide to the profound wisdom of Vedic scriptures and Vedanta philosophy.

**What I offer:**
- Interactive lessons on Vedic texts (Upanishads, Bhagavad Gita, etc.)
- Personalized spiritual guidance
- Structured learning paths from beginner to advanced
- Q&A sessions on philosophical concepts

**Note:** I'm currently experiencing some connectivity issues, but you can still explore the course structure in the sidebar and I'll be back online shortly!

How would you like to begin your spiritual journey today?`
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSendMessage = useCallback(async (text: string, topicId?: string) => {
    if (!text.trim() || isLoading || !chatSession || !isAuthenticated) return;
    
    // Enforce free tier message limit for all users initially
    if (dailyMessageCount >= FREE_TIER_MESSAGE_LIMIT) {
      alert(`You've reached your daily limit of ${FREE_TIER_MESSAGE_LIMIT} messages. Please try again tomorrow, or we'll introduce Sage Pass soon for unlimited access!`);
      return;
    }

    if (topicId && !completedTopics.includes(topicId)) {
      setCompletedTopics(prev => [...prev, topicId]);
    }

    const userMessage: Message = { id: `user-${Date.now()}`, role: Role.USER, text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (!isPaidSubscriber) {
      setDailyMessageCount(prev => prev + 1);
    }

    const modelMessageId = `model-${Date.now()}`;
    setMessages(prev => [...prev, { id: modelMessageId, role: Role.MODEL, text: '' }]);

    try {
      const stream = await sendMessageStream(chatSession, text, user?.id);
      for await (const chunk of stream) {
         setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: m.text + chunk } : m));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: "I seem to have encountered an error. My apologies. Please try a different question." } : m));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatSession, completedTopics, isAuthenticated, isPaidSubscriber, dailyMessageCount]);
  
  const handleTopicSelect = (prompt: string, id: string, isPremium: boolean) => {
    if (!isAuthenticated) {
      alert("Please log in to begin a lesson.");
      return;
    }
    // Remove premium gating - all content accessible with message limits
    handleSendMessage(prompt, id);
  };





  // Calculate messages left for all users
  const messagesLeft = FREE_TIER_MESSAGE_LIMIT - dailyMessageCount;

  // Show admin dashboard if requested
  if (showAdminDashboard && isAdmin) {
    return <AdminDashboard />;
  }

  // Handle page navigation
  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentPage('main')} />;
  }
  if (currentPage === 'terms') {
    return <TermsOfService onBack={() => setCurrentPage('main')} />;
  }
  if (currentPage === 'support') {
    return <SupportPage onBack={() => setCurrentPage('main')} />;
  }



  return (
    <>
      {/* Show landing page for non-authenticated users */}
      <SignedOut>
        <LandingPage onNavigate={setCurrentPage} />
      </SignedOut>

      {/* Show main app for authenticated users */}
      <SignedIn>
        <div className="flex h-screen font-sans bg-vedic-bg text-vedic-primary-text">
        <Sidebar
          course={COURSE_STRUCTURE}
          onSelectTopic={handleTopicSelect}
          disabled={isLoading}
          completedTopics={completedTopics}
          isAuthenticated={isAuthenticated}
          isPaidSubscriber={isPaidSubscriber}
        />
        <main className="flex flex-col flex-1 h-screen">
          <header className="p-4 border-b border-vedic-border bg-vedic-bg-alt shadow-sm flex justify-between items-center">
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-serif text-vedic-accent-dark">Vedanta Vision: The Sage AI</h1>
                <p className="text-sm text-vedic-secondary-text">Your Conversational Guide to Vedic Wisdom</p>
              </div>
              <div className="flex items-center gap-4">
                <SignedIn>
                  <button
                    onClick={() => setIsJourneyMapOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 border border-vedic-border text-vedic-accent-dark font-semibold hover:bg-vedic-surface transition-colors"
                    aria-label="View My Learning Journey"
                  >
                    <MapIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">My Journey</span>
                  </button>


                  {isAdmin && (
                    <button
                      onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                    >
                      ⚙️ <span className="hidden sm:inline">Admin</span>
                    </button>
                  )}
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <button className="px-4 py-2 rounded-lg bg-vedic-accent text-white font-semibold hover:bg-vedic-accent-dark transition-colors">
                      Login
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
          </header>
          <ChatWindow messages={messages} isLoading={isLoading} onNudgeClick={handleSendMessage} />
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            isPaidSubscriber={isPaidSubscriber}
            messagesLeft={messagesLeft}
            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
          />
        </main>


      </div>

      <JourneyMapModal
        isOpen={isJourneyMapOpen}
        onClose={() => setIsJourneyMapOpen(false)}
        course={COURSE_STRUCTURE}
        completedTopics={completedTopics}
      />

      </SignedIn>
    </>
  );
};

export default App;