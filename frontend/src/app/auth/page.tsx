"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'cancelled':
          setErrorMessage('Login was cancelled. Please try again.');
          break;
        case 'oauth_failed':
          setErrorMessage('Login failed. Please try again.');
          break;
        case 'server_error':
          setErrorMessage('Something went wrong. Please try again later.');
          break;
        default:
          setErrorMessage('An error occurred during login. Please try again.');
      }
      
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:8000/auth/login';
  };

  const handleGitHubAuth = () => {
    // window.location.href = 'http://localhost:8000/auth/github';
  };

  return (
    <main className="min-h-screen text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side - Hero Text */}
        <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
                Revolutionize
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Lead Searching
              </span>
            </h1>
            
            <p className="text-zinc-300 text-xl md:text-2xl max-w-lg mx-auto lg:mx-0">
              Join the next generation of professionals who've transformed their lead generation with AI-powered precision.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start space-x-2 pt-4">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-400 text-sm">Sign in once, access everywhere</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              <span className="text-zinc-300">Smart AI Analysis</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-zinc-300">Regular Updates</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>
              <span className="text-zinc-300">Thousands of Businesses</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              <span className="text-zinc-300">Accurate Information</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Modal */}
        <div className="order-1 lg:order-2">
          <div className="relative max-w-md mx-auto">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            
            {/* Auth card */}
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
              
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">
                  Welcome to Leadlift
                </h2>
                <p className="text-zinc-400 text-sm">
                  Sign in with your preferred method to get started
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                </div>
              )}

              {/* Auth buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-zinc-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 transform"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* <button 
                  onClick={handleGitHubAuth}
                  className="w-full flex items-center justify-center space-x-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-lg border border-zinc-700 transition-all duration-200 hover:scale-105 transform"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </button> */}
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-zinc-500">
                  Secure authentication powered by industry-standard OAuth 2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}