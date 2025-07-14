import React, { useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';

const LandingPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isSignedIn) {
    return null; // Don't show landing page if user is signed in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vedic-bg via-vedic-bg-alt to-vedic-surface">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-vedic-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-vedic-accent">🕉️ Vedanta Vision</div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-vedic-primary-text hover:text-vedic-accent transition-colors">Features</a>
              <a href="#about" className="text-vedic-primary-text hover:text-vedic-accent transition-colors">About</a>
              <SignInButton>
                <button className="text-vedic-accent hover:text-vedic-accent-dark transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-vedic-accent text-white px-6 py-2 rounded-lg hover:bg-vedic-accent-dark transition-colors">
                  Start Learning
                </button>
              </SignUpButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-vedic-primary-text hover:text-vedic-accent"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-vedic-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-vedic-primary-text hover:text-vedic-accent">Features</a>
                <a href="#about" className="block px-3 py-2 text-vedic-primary-text hover:text-vedic-accent">About</a>
                <div className="flex flex-col space-y-2 px-3 py-2">
                  <SignInButton>
                    <button className="text-left text-vedic-accent hover:text-vedic-accent-dark">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-vedic-accent text-white px-4 py-2 rounded-lg hover:bg-vedic-accent-dark text-center">
                      Start Learning
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-vedic-accent-dark mb-6">
              Master Ancient Wisdom with
              <span className="block text-vedic-accent">AI-Powered Vedanta</span>
            </h1>
            <p className="text-xl sm:text-2xl text-vedic-secondary-text mb-8 max-w-3xl mx-auto">
              Learn Vedanta, Upanishads, and Sanskrit from Professor Arya - your personal AI guru. 
              Experience authentic spiritual teachings adapted for the modern seeker.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <SignUpButton>
                <button className="bg-vedic-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-vedic-accent-dark transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto">
                  🚀 Start Your Journey Free
                </button>
              </SignUpButton>
              <SignInButton>
                <button className="border-2 border-vedic-accent text-vedic-accent px-8 py-4 rounded-lg text-lg font-semibold hover:bg-vedic-accent hover:text-white transition-all w-full sm:w-auto">
                  📚 Continue Learning
                </button>
              </SignInButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-vedic-secondary-text">
              <div className="flex items-center gap-2">
                <span className="text-vedic-accent">•</span>
                <span>Authentic Sanskrit Sources</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vedic-accent">•</span>
                <span>Contemplative Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vedic-accent">•</span>
                <span>Timeless Wisdom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-vedic-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-vedic-accent/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-vedic-accent-dark mb-4">
              Why Choose Vedanta Vision?
            </h2>
            <p className="text-xl text-vedic-secondary-text max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🧘‍♂️</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Personal AI Guru</h3>
              <p className="text-vedic-secondary-text">
                Professor Arya provides personalized guidance based on authentic Vedantic texts and your learning pace.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Authentic Sources</h3>
              <p className="text-vedic-secondary-text">
                Learn from original Sanskrit texts, Upanishads, and commentaries by great masters like Adi Shankaracharya.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Global Accessibility</h3>
              <p className="text-vedic-secondary-text">
                Available in multiple currencies (USD, INR) with mobile-first design for learning anywhere, anytime.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Structured Learning</h3>
              <p className="text-vedic-secondary-text">
                Progressive curriculum from basic concepts to advanced philosophy, tailored to your spiritual journey.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Interactive Dialogue</h3>
              <p className="text-vedic-secondary-text">
                Engage in meaningful conversations, ask questions, and receive detailed explanations in real-time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-vedic-bg p-8 rounded-xl border border-vedic-border hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-vedic-accent-dark mb-3">Privacy Focused</h3>
              <p className="text-vedic-secondary-text">
                Your spiritual journey is personal. We prioritize your privacy and data security above all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-vedic-bg-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-vedic-accent-dark mb-8">
            A Digital Sanctuary for Vedantic Learning
          </h2>
          <p className="text-lg text-vedic-secondary-text leading-relaxed mb-8">
            Created with reverence for the ancient wisdom traditions, this platform offers a contemplative space
            to explore the profound teachings of Vedanta. Each conversation is an opportunity to deepen your
            understanding of these timeless truths that have guided seekers for millennia.
          </p>
          <div className="text-sm text-vedic-secondary-text">
            <p>Thoughtfully developed by <span className="font-medium text-vedic-accent">GreyBrain.ai</span></p>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-vedic-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Begin Your Journey Within
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Step into a space of contemplative learning where ancient wisdom meets modern understanding.
            Your exploration of Vedantic truth awaits.
          </p>

          <SignUpButton>
            <button className="bg-white text-vedic-accent px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              🕉️ Enter the Sanctuary
            </button>
          </SignUpButton>

          <p className="text-sm mt-4 opacity-75">
            A contemplative space for spiritual learning
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vedic-accent-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold mb-4">🕉️ Vedanta Vision</div>
              <p className="text-gray-300 mb-4">
                Bridging ancient wisdom with modern technology to make Vedantic knowledge accessible to all.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
                <a href="#" className="text-gray-300 hover:text-white">Terms</a>
                <a href="#" className="text-gray-300 hover:text-white">Support</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Vedanta Basics</a></li>
                <li><a href="#" className="hover:text-white">Upanishads</a></li>
                <li><a href="#" className="hover:text-white">Sanskrit</a></li>
                <li><a href="#" className="hover:text-white">Meditation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Vedanta Vision. All rights reserved. Made with 🙏 for spiritual seekers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
