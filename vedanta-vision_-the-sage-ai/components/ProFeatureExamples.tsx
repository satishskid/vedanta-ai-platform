import React, { useState } from 'react';
import ProFeatureGate, { useProFeature, ProBadge, FeatureStatus } from './ProFeatureGate';

// Example: Unlimited Messages Feature
export const UnlimitedMessagesExample: React.FC<{ onUpgradeClick: () => void }> = ({ onUpgradeClick }) => {
  const { canAccess } = useProFeature('unlimited-messages');
  const [messageCount] = useState(8); // Simulate 8 messages used today

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-vedic-accent-dark">Daily Message Limit</h3>
        <FeatureStatus featureId="unlimited-messages" />
      </div>

      {canAccess ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🚀</div>
          <h4 className="text-xl font-semibold text-vedic-accent mb-2">Unlimited Messages Active!</h4>
          <p className="text-vedic-secondary-text">
            You can send unlimited messages to Professor Arya. No daily limits apply.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <ProBadge plan="pro" />
            <span className="text-sm text-vedic-secondary-text">Pro Feature Active</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-vedic-secondary-text">Messages used today:</span>
            <span className="font-semibold text-vedic-accent">{messageCount}/10</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-vedic-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(messageCount / 10) * 100}%` }}
            ></div>
          </div>

          {messageCount >= 10 ? (
            <ProFeatureGate 
              featureId="unlimited-messages" 
              onUpgradeClick={onUpgradeClick}
              showUpgradePrompt={true}
            >
              <div>This won't show because limit is reached</div>
            </ProFeatureGate>
          ) : (
            <div className="text-center">
              <p className="text-sm text-vedic-secondary-text mb-3">
                {10 - messageCount} messages remaining today
              </p>
              <button
                onClick={onUpgradeClick}
                className="text-vedic-accent hover:text-vedic-accent-dark text-sm font-medium"
              >
                Upgrade for unlimited messages →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example: Advanced Sanskrit Dictionary
export const SanskritDictionaryExample: React.FC<{ onUpgradeClick: () => void }> = ({ onUpgradeClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-vedic-accent-dark">Sanskrit Dictionary</h3>
          <ProBadge plan="pro" />
        </div>
        <FeatureStatus featureId="sanskrit-dictionary" />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Sanskrit words..."
          className="w-full px-4 py-2 border border-vedic-border rounded-lg focus:ring-2 focus:ring-vedic-accent focus:border-transparent"
        />
      </div>

      <ProFeatureGate 
        featureId="sanskrit-dictionary" 
        onUpgradeClick={onUpgradeClick}
        fallback={
          <div className="text-center py-8 bg-vedic-bg rounded-lg">
            <div className="text-4xl mb-4">📚</div>
            <h4 className="font-semibold text-vedic-accent-dark mb-2">Advanced Sanskrit Dictionary</h4>
            <p className="text-vedic-secondary-text mb-4">
              Get detailed etymology, multiple meanings, and usage examples for Sanskrit words.
            </p>
            <button
              onClick={onUpgradeClick}
              className="bg-vedic-accent text-white px-6 py-2 rounded-lg hover:bg-vedic-accent-dark transition-colors"
            >
              Unlock Pro Dictionary
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {searchTerm ? (
            <div className="bg-vedic-bg p-4 rounded-lg">
              <h4 className="font-semibold text-vedic-accent-dark mb-2">{searchTerm}</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Etymology:</strong> From Sanskrit root √{searchTerm.slice(0, 3)}</p>
                <p><strong>Meaning:</strong> [Detailed meaning would appear here]</p>
                <p><strong>Usage:</strong> Found in Bhagavad Gita 2.47, Upanishads...</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-vedic-secondary-text py-4">
              Enter a Sanskrit word to see detailed analysis
            </div>
          )}
        </div>
      </ProFeatureGate>
    </div>
  );
};

// Example: Learning Analytics
export const LearningAnalyticsExample: React.FC<{ onUpgradeClick: () => void }> = ({ onUpgradeClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-vedic-accent-dark">Learning Analytics</h3>
          <ProBadge plan="pro" />
        </div>
        <FeatureStatus featureId="learning-analytics" />
      </div>

      <ProFeatureGate 
        featureId="learning-analytics" 
        onUpgradeClick={onUpgradeClick}
      >
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-vedic-bg p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-vedic-accent">47</div>
              <div className="text-sm text-vedic-secondary-text">Topics Completed</div>
            </div>
            <div className="bg-vedic-bg p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">23h</div>
              <div className="text-sm text-vedic-secondary-text">Study Time</div>
            </div>
            <div className="bg-vedic-bg p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-vedic-secondary-text">Questions Asked</div>
            </div>
          </div>

          {/* Learning Path Progress */}
          <div>
            <h4 className="font-medium text-vedic-accent-dark mb-3">Learning Path Progress</h4>
            <div className="space-y-2">
              {[
                { topic: 'Vedanta Basics', progress: 100 },
                { topic: 'Upanishads Introduction', progress: 75 },
                { topic: 'Sanskrit Fundamentals', progress: 45 },
                { topic: 'Meditation Practices', progress: 20 }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-vedic-secondary-text">{item.topic}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-vedic-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-vedic-accent">{item.progress}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Graph Preview */}
          <div>
            <h4 className="font-medium text-vedic-accent-dark mb-3">Knowledge Connections</h4>
            <div className="bg-vedic-bg p-4 rounded-lg text-center">
              <div className="text-4xl mb-2">🕸️</div>
              <p className="text-sm text-vedic-secondary-text">
                Visual map of your learning connections would appear here
              </p>
            </div>
          </div>
        </div>
      </ProFeatureGate>
    </div>
  );
};

// Example: Conversation History
export const ConversationHistoryExample: React.FC<{ onUpgradeClick: () => void }> = ({ onUpgradeClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-vedic-accent-dark">Conversation History</h3>
          <ProBadge plan="pro" />
        </div>
        <FeatureStatus featureId="conversation-history" />
      </div>

      <ProFeatureGate 
        featureId="conversation-history" 
        onUpgradeClick={onUpgradeClick}
      >
        <div className="space-y-4">
          {[
            {
              date: '2024-01-15',
              topic: 'Understanding Karma Yoga',
              messages: 12,
              summary: 'Discussed the principles of selfless action and detachment from results'
            },
            {
              date: '2024-01-14',
              topic: 'Sanskrit Pronunciation',
              messages: 8,
              summary: 'Learned proper pronunciation of key mantras and Sanskrit terms'
            },
            {
              date: '2024-01-13',
              topic: 'Meditation Techniques',
              messages: 15,
              summary: 'Explored different meditation practices from the Upanishads'
            }
          ].map((conversation, index) => (
            <div key={index} className="border border-vedic-border rounded-lg p-4 hover:bg-vedic-bg transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-vedic-accent-dark">{conversation.topic}</h4>
                <span className="text-sm text-vedic-secondary-text">{conversation.date}</span>
              </div>
              <p className="text-sm text-vedic-secondary-text mb-2">{conversation.summary}</p>
              <div className="text-xs text-vedic-secondary-text">
                {conversation.messages} messages • Click to continue conversation
              </div>
            </div>
          ))}
          
          <div className="text-center">
            <button className="text-vedic-accent hover:text-vedic-accent-dark text-sm font-medium">
              View All Conversations →
            </button>
          </div>
        </div>
      </ProFeatureGate>
    </div>
  );
};

// Main demo component
const ProFeatureExamples: React.FC = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    // In real app, this would open the payment modal
    console.log('🚀 Upgrade clicked - would open payment modal');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-vedic-accent-dark mb-2">Pro Features Demo</h2>
        <p className="text-vedic-secondary-text">
          These examples show how Pro features are gated and activated after payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UnlimitedMessagesExample onUpgradeClick={handleUpgradeClick} />
        <SanskritDictionaryExample onUpgradeClick={handleUpgradeClick} />
        <LearningAnalyticsExample onUpgradeClick={handleUpgradeClick} />
        <ConversationHistoryExample onUpgradeClick={handleUpgradeClick} />
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-vedic-accent-dark mb-4">Upgrade to Pro</h3>
            <p className="text-vedic-secondary-text mb-6">
              This would open the actual payment gateway (Stripe/Razorpay) in production.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 border border-vedic-border text-vedic-accent py-2 rounded-lg hover:bg-vedic-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Simulate successful payment
                  console.log('💳 Payment successful - features would be activated');
                }}
                className="flex-1 bg-vedic-accent text-white py-2 rounded-lg hover:bg-vedic-accent-dark transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProFeatureExamples;
