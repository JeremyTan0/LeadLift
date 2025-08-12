"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: "🎯", text: "AI-Powered Analysis", delay: "delay-100" },
    { icon: "⚡", text: "Lightning Fast", delay: "delay-200" },
    { icon: "📈", text: "Convert More", delay: "delay-300" },
  ];

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* Dynamic background gradient */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), transparent 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-4xl text-center space-y-12">
          
          {/* Main hero section */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-zinc-300">Intelligent Searching</span>
            </div>

            {/* Main headline */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white animate-gradient-x">
                  Lead
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                  lift
                </span>
              </h1>
              
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed">
                  Transform your lead generation with AI that finds, qualifies, and delivers 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> perfect prospects </span>
                  directly to you.
                </p>
                
                <p className="text-zinc-400 text-lg">
                  Join a new generation of sales teams generating more qualified leads, faster.
                </p>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-full px-6 py-3 hover:border-white/20 transition-all duration-300 hover:scale-105 animate-fade-in ${feature.delay}`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-zinc-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Main CTA button */}
            <Link href="/auth">
              <div className="relative inline-block group cursor-pointer">
                {/* Animated background glow */}
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse group-hover:animate-none scale-105 group-hover:scale-110" />
                
                {/* Button */}
                <span className="relative inline-block px-8 py-4 text-xl font-bold text-white bg-zinc-900 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-zinc-800 transition-all duration-300 hover:scale-105 shadow-2xl">
                  Start Finding Leads →
                </span>
              </div>
            </Link>

            {/* Subtext */}
            {/* <p className="text-zinc-500 text-sm max-w-md mx-auto">
              No credit card required • Free 14-day trial • Cancel anytime
            </p> */}
          </div>

        </div>
      </div>


      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}