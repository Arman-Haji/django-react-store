// pages/Home.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const FEATURES = [
  { icon: '🚀', title: 'Fast', description: 'Lightning fast performance' },
  { icon: '🔒', title: 'Secure', description: 'Your data is protected' },
  { icon: '💡', title: 'Smart', description: 'Intelligent features' },
];

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-md dark:hover:shadow-gray-800/50 transition duration-200">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
  </div>
);

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/30 p-8 animate-fade-in transition-colors duration-200">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome to MyApp
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              {user 
                ? `Hello, ${user.username || 'User'}! 👋` 
                : 'Please login or sign up to continue'}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-8 py-3 bg-brand-blue hover:bg-brand-dark dark:bg-brand-blue dark:hover:bg-brand-dark text-white font-medium rounded-xl transition duration-200 text-center"
                >
                  Go to Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition duration-200 text-center"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-brand-blue hover:bg-brand-dark dark:bg-brand-blue dark:hover:bg-brand-dark text-white font-medium rounded-xl transition duration-200 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition duration-200 text-center"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;