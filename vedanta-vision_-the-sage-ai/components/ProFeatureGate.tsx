import React from 'react';
import { useUser } from '@clerk/clerk-react';
import ProFeaturesService from '../services/proFeaturesService';

interface ProFeatureGateProps {
  featureId?: string;
  moduleId?: string;
  minimumPlan?: 'free' | 'pro' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  onUpgradeClick?: () => void;
}

const ProFeatureGate: React.FC<ProFeatureGateProps> = ({
  featureId,
  moduleId,
  minimumPlan = 'pro',
  children,
  fallback,
  showUpgradePrompt = true,
  onUpgradeClick
}) => {
  const { user } = useUser();
  const proService = ProFeaturesService.getInstance();

  // Get user's current plan from Clerk metadata
  const userPlan = (user?.publicMetadata?.plan as 'free' | 'pro' | 'enterprise') || 'free';
  const isPaidSubscriber = user?.publicMetadata?.isPaidSubscriber === true;

  // Check if user can access the feature/module
  const canAccess = () => {
    // If it's a free feature, always allow
    if (minimumPlan === 'free') return true;

    // Check if user has paid subscription
    if (!isPaidSubscriber) return false;

    // Check specific feature access
    if (featureId) {
      return proService.canAccessFeature(featureId, userPlan) && proService.isFeatureEnabled(featureId);
    }

    // Check specific module access
    if (moduleId) {
      return proService.canAccessModule(moduleId, userPlan) && proService.isModuleEnabled(moduleId);
    }

    // Check general plan access
    const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
    return planHierarchy[userPlan] >= planHierarchy[minimumPlan];
  };

  // If user can access, show the content
  if (canAccess()) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt if enabled
  if (showUpgradePrompt) {
    return (
      <div className="bg-gradient-to-br from-vedic-accent/10 to-vedic-accent/5 border border-vedic-accent/20 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold text-vedic-accent-dark mb-2">
          {minimumPlan === 'pro' ? 'Pro Feature' : 'Enterprise Feature'}
        </h3>
        <p className="text-vedic-secondary-text mb-4">
          {featureId && (
            <>This feature requires a {minimumPlan} subscription to access.</>
          )}
          {moduleId && (
            <>This module requires a {minimumPlan} subscription to access.</>
          )}
          {!featureId && !moduleId && (
            <>This content requires a {minimumPlan} subscription to access.</>
          )}
        </p>
        
        <div className="space-y-3">
          {minimumPlan === 'pro' && (
            <div className="text-sm text-vedic-secondary-text">
              <div className="font-medium text-vedic-accent">Pro Plan includes:</div>
              <ul className="text-left mt-2 space-y-1">
                <li>✓ Unlimited messages with Professor Arya</li>
                <li>✓ Advanced courses and premium content</li>
                <li>✓ Priority API access for faster responses</li>
                <li>✓ Conversation history and analytics</li>
                <li>✓ Personalized learning paths</li>
              </ul>
            </div>
          )}
          
          {minimumPlan === 'enterprise' && (
            <div className="text-sm text-vedic-secondary-text">
              <div className="font-medium text-vedic-accent">Enterprise Plan includes:</div>
              <ul className="text-left mt-2 space-y-1">
                <li>✓ Everything in Pro</li>
                <li>✓ Custom API integrations</li>
                <li>✓ White-label options</li>
                <li>✓ Advanced analytics dashboard</li>
                <li>✓ Dedicated support</li>
              </ul>
            </div>
          )}
          
          <button
            onClick={onUpgradeClick}
            className="bg-vedic-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-vedic-accent-dark transition-colors"
          >
            {minimumPlan === 'pro' ? '🚀 Upgrade to Pro' : '🏢 Upgrade to Enterprise'}
          </button>
          
          <div className="text-xs text-vedic-secondary-text">
            {minimumPlan === 'pro' ? '₹1,499/month (~$18 USD)' : '₹3,999/month (~$48 USD)'}
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if no fallback and no upgrade prompt
  return null;
};

// Hook for checking feature access
export const useProFeature = (featureId: string) => {
  const { user } = useUser();
  const proService = ProFeaturesService.getInstance();
  
  const userPlan = (user?.publicMetadata?.plan as 'free' | 'pro' | 'enterprise') || 'free';
  const isPaidSubscriber = user?.publicMetadata?.isPaidSubscriber === true;
  
  const canAccess = isPaidSubscriber && 
    proService.canAccessFeature(featureId, userPlan) && 
    proService.isFeatureEnabled(featureId);
  
  const isEnabled = proService.isFeatureEnabled(featureId);
  
  return {
    canAccess,
    isEnabled,
    userPlan,
    isPaidSubscriber
  };
};

// Hook for checking module access
export const useProModule = (moduleId: string) => {
  const { user } = useUser();
  const proService = ProFeaturesService.getInstance();
  
  const userPlan = (user?.publicMetadata?.plan as 'free' | 'pro' | 'enterprise') || 'free';
  const isPaidSubscriber = user?.publicMetadata?.isPaidSubscriber === true;
  
  const canAccess = isPaidSubscriber && 
    proService.canAccessModule(moduleId, userPlan) && 
    proService.isModuleEnabled(moduleId);
  
  const isEnabled = proService.isModuleEnabled(moduleId);
  
  return {
    canAccess,
    isEnabled,
    userPlan,
    isPaidSubscriber
  };
};

// Component for showing Pro badge
export const ProBadge: React.FC<{ plan?: 'pro' | 'enterprise' }> = ({ plan = 'pro' }) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
    plan === 'pro' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800'
  }`}>
    {plan === 'pro' ? '⭐ PRO' : '👑 ENTERPRISE'}
  </span>
);

// Component for showing feature status
export const FeatureStatus: React.FC<{ featureId: string }> = ({ featureId }) => {
  const { canAccess, isEnabled } = useProFeature(featureId);
  
  if (canAccess && isEnabled) {
    return <span className="text-green-600 text-sm">✓ Active</span>;
  }
  
  if (isEnabled && !canAccess) {
    return <span className="text-yellow-600 text-sm">🔒 Requires Upgrade</span>;
  }
  
  return <span className="text-gray-500 text-sm">○ Disabled</span>;
};

export default ProFeatureGate;
