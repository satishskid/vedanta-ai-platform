import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { type Message, Role } from './types';
import { COURSE_STRUCTURE, FREE_TIER_MESSAGE_LIMIT } from './constants';
import { createChatSession, sendMessageStream } from './services/geminiService';
import AnalyticsService from './services/analyticsService';
import ProFeaturesService from './services/proFeaturesService';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import JourneyMapModal from './components/JourneyMapModal';
import UpgradeModal from './components/UpgradeModal';
import AdminDashboard from './components/AdminDashboard';
import APIHealthIndicator from './components/APIHealthIndicator';
import LandingPage from './components/LandingPage';
import JagannathaTatvaModule from './components/JagannathaTatvaModule';
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

  // Track user session for analytics and load Pro features
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const analytics = AnalyticsService.getInstance();
      analytics.trackUserSession(user.id);

      // Load Pro features configuration
      const proService = ProFeaturesService.getInstance();
      proService.loadFromStorage();
    }
  }, [isAuthenticated, user?.id]);

  // State for daily message limit for free users
  const [dailyMessageCount, setDailyMessageCount] = useState<number>(0);

  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isJourneyMapOpen, setIsJourneyMapOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showJagannathaTatva, setShowJagannathaTatva] = useState(false);

  // Check if user is admin (temporarily allowing all authenticated users for demo)
  const isAdmin = isAuthenticated || // Temporary: any authenticated user can access admin
                  user?.publicMetadata?.isAdmin === true ||
                  user?.emailAddresses?.[0]?.emailAddress?.includes('admin');

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
    
    // Check if user has unlimited messages (Pro feature)
    const proService = ProFeaturesService.getInstance();
    const hasUnlimitedMessages = proService.isFeatureEnabled('unlimited-messages') && isPaidSubscriber;

    // Enforce free tier message limit only if user doesn't have unlimited messages
    if (!hasUnlimitedMessages && dailyMessageCount >= FREE_TIER_MESSAGE_LIMIT) {
      setIsUpgradeModalOpen(true);
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
    if (isPremium && !isPaidSubscriber) {
      setIsUpgradeModalOpen(true);
      return;
    }
    handleSendMessage(prompt, id);
  };



  const handleSimulatedUpgrade = () => {
    // In a real app, this would redirect to payment processing
    // For now, just close the modal
    setIsUpgradeModalOpen(false);
  }

  // Calculate messages left (unlimited for Pro users)
  const proService = ProFeaturesService.getInstance();
  const hasUnlimitedMessages = proService.isFeatureEnabled('unlimited-messages') && isPaidSubscriber;
  const messagesLeft = hasUnlimitedMessages ? -1 : FREE_TIER_MESSAGE_LIMIT - dailyMessageCount;

  // Show admin dashboard if requested
  if (showAdminDashboard && isAdmin) {
    return <AdminDashboard />;
  }

  // Show Jagannatha Tatva module if requested
  if (showJagannathaTatva) {
    return <JagannathaTatvaModule />;
  }

  return (
    <>
      {/* Show landing page for non-authenticated users */}
      <SignedOut>
        <LandingPage />
      </SignedOut>

      {/* Show main app for authenticated users */}
      <SignedIn>
        <div className="flex h-screen font-sans bg-vedic-bg text-vedic-primary-text">
        <Sidebar
          course={COURSE_STRUCTURE}
          onSelectTopic={handleTopicSelect}
          onPremiumClick={() => setIsUpgradeModalOpen(true)}
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
                  {!isPaidSubscriber && (
                     <button onClick={() => setIsUpgradeModalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors">
                       <StarIcon className="w-5 h-5" />
                       <span className="hidden sm:inline">Go Pro</span>
                     </button>
                  )}
                  <button
                    onClick={() => setShowJagannathaTatva(!showJagannathaTatva)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    🏛️ <span className="hidden sm:inline">Jagannatha Tatva</span>
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

        {/* API Health Indicator - always visible */}
        <APIHealthIndicator />
      </div>

      <JourneyMapModal
        isOpen={isJourneyMapOpen}
        onClose={() => setIsJourneyMapOpen(false)}
        course={COURSE_STRUCTURE}
        completedTopics={completedTopics}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleSimulatedUpgrade}
      />
      </SignedIn>
    </>
  );
};

export default App;