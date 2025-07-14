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
              <a href="#pricing" className="text-vedic-primary-text hover:text-vedic-accent transition-colors">Pricing</a>
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
                <a href="#pricing" className="block px-3 py-2 text-vedic-primary-text hover:text-vedic-accent">Pricing</a>
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
                <span className="text-green-500">✓</span>
                <span>10+ Daily Messages Free</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Authentic Sanskrit Sources</span>
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

      {/* Social Proof */}
      <section className="py-16 bg-vedic-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-vedic-accent-dark mb-12">
            Trusted by Spiritual Seekers Worldwide
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-vedic-accent">1000+</div>
              <div className="text-vedic-secondary-text">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-vedic-accent">50+</div>
              <div className="text-vedic-secondary-text">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-vedic-accent">10k+</div>
              <div className="text-vedic-secondary-text">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-vedic-accent">4.9★</div>
              <div className="text-vedic-secondary-text">User Rating</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-vedic-secondary-text mb-4 italic">
                "Professor Arya helped me understand complex Vedantic concepts that I struggled with for years. The explanations are clear and authentic."
              </p>
              <div className="font-semibold text-vedic-accent-dark">- Priya S., Mumbai</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-vedic-secondary-text mb-4 italic">
                "As a busy professional, having 24/7 access to Vedantic wisdom has transformed my spiritual practice. Highly recommended!"
              </p>
              <div className="font-semibold text-vedic-accent-dark">- David M., California</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-vedic-secondary-text mb-4 italic">
                "The Sanskrit explanations and authentic sources make this the most reliable platform for learning Vedanta online."
              </p>
              <div className="font-semibold text-vedic-accent-dark">- Dr. Rajesh K., Delhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-vedic-accent-dark mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-vedic-secondary-text max-w-2xl mx-auto">
              Start your spiritual journey for free. Upgrade when you're ready for unlimited learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-vedic-bg border-2 border-vedic-border rounded-xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-vedic-accent-dark mb-2">Free</h3>
                <div className="text-4xl font-bold text-vedic-accent mb-4">₹0<span className="text-lg text-vedic-secondary-text">/month</span></div>
                <p className="text-vedic-secondary-text mb-6">Perfect for getting started</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>10 messages per day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Basic course access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mobile responsive</span>
                  </li>
                </ul>

                <SignUpButton>
                  <button className="w-full bg-vedic-accent text-white py-3 rounded-lg font-semibold hover:bg-vedic-accent-dark transition-colors">
                    Start Free
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-vedic-bg border-2 border-vedic-accent rounded-xl p-8 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-vedic-accent text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-vedic-accent-dark mb-2">Pro</h3>
                <div className="text-4xl font-bold text-vedic-accent mb-2">₹1,499<span className="text-lg text-vedic-secondary-text">/month</span></div>
                <div className="text-sm text-vedic-secondary-text mb-4">~$18 USD</div>
                <p className="text-vedic-secondary-text mb-6">Unlimited spiritual learning</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Unlimited messages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Premium course content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Priority AI access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Advanced workshops</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Personal learning path</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Email support</span>
                  </li>
                </ul>

                <SignUpButton>
                  <button className="w-full bg-vedic-accent text-white py-3 rounded-lg font-semibold hover:bg-vedic-accent-dark transition-colors">
                    Upgrade to Pro
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-vedic-bg border-2 border-vedic-border rounded-xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-vedic-accent-dark mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-vedic-accent mb-2">₹3,999<span className="text-lg text-vedic-secondary-text">/month</span></div>
                <div className="text-sm text-vedic-secondary-text mb-4">~$48 USD</div>
                <p className="text-vedic-secondary-text mb-6">For institutions & teachers</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Custom API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Custom integrations</span>
                  </li>
                </ul>

                <button className="w-full border-2 border-vedic-accent text-vedic-accent py-3 rounded-lg font-semibold hover:bg-vedic-accent hover:text-white transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-vedic-secondary-text mb-4">
              All plans include mobile access, secure data, and regular updates
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-vedic-secondary-text">
              <span>✓ 30-day money-back guarantee</span>
              <span>✓ Cancel anytime</span>
              <span>✓ No setup fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-vedic-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Begin Your Spiritual Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of seekers discovering the timeless wisdom of Vedanta. 
            Start with 10 free messages daily - no commitment required.
          </p>
          
          <SignUpButton>
            <button className="bg-white text-vedic-accent px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              🕉️ Start Learning Free
            </button>
          </SignUpButton>
          
          <p className="text-sm mt-4 opacity-75">
            Free forever • Upgrade anytime • Cancel anytime
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
