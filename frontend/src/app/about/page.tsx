"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
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
    {
      icon: "🤖",
      title: "AI-Powered Discovery",
      description: "Our advanced machine learning algorithms analyze various data points to deliver accurate SEO reviews."
    },
    {
      icon: "⚡",
      title: "Real-Time Intelligence",
      description: "Get instant access to verified business information, contact details, and market insights updated in real-time from trusted data sources."
    },
    {
      icon: "🎯",
      title: "Availability",
      description: "Search through millions of businesses worldwide, unrestricted by geographical location or business type."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users", icon: "👥" },
    { number: "2.5M+", label: "Businesses Indexed", icon: "🏢" },
    { number: "94.2%", label: "Match Accuracy", icon: "🎯" },
    { number: "300%", label: "Lead Increase", icon: "📈" }
  ];

  const team = [
    {
      name: "Jeremy Tan",
      role: "Developer",
      description: "B.S. CS @ OSU",
      image: "👷‍♂️"
    },
  ];

  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-zinc-950">
      {/* Dynamic background gradient */}
      <div 
        className="absolute inset-0 opacity-15 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.08), rgba(236, 72, 153, 0.08), transparent 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-40"
            style={{
              left: `${10 + i * 8}%`,
              top: `${5 + (i % 5) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-zinc-300">Revolutionizing B2B Lead Generation</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold leading-none mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">
                About
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                Leadlift
              </span>
            </h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed">
                We're transforming how businesses discover and connect with their ideal prospects through 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> intelligent automation </span>
                and data-driven insights.
              </p>
              
              {/* <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                Founded in 2023, Leadlift has helped over 10,000 sales professionals generate millions of qualified leads, 
                resulting in over $500M in pipeline value for our customers.
              </p> */}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="max-w-6xl mx-auto px-6 py-16">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Trusted by Thousands
              </span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 group-hover:border-white/20">
                      <div className="text-4xl mb-4">{stat.icon}</div>
                      <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-zinc-300 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Mission Section */}
        {/* <section className="max-w-6xl mx-auto px-6 py-16">
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Our Mission
                </span>
              </h2>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-50" />
              <div className="relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
                <blockquote className="text-2xl md:text-3xl leading-relaxed text-zinc-200 italic mb-8">
                  "To revolutionize B2B lead generation by making advanced AI tools accessible to businesses and agenies of all sizes, 
                  helping them identify and connect with their perfect customers efficiently and effectively."
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                    🚀
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Leadlift Team</div>
                    <div className="text-zinc-400 text-sm">Building the future of sales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  What Makes Us Different
                </span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Advanced technology meets intuitive design to deliver unparalleled lead generation results.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative h-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 group-hover:border-white/20">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="max-w-6xl mx-auto px-6 py-16">
          <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Meet Our Team
                </span>
              </h2> */}
              {/* <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Industry veterans and AI experts working together to revolutionize lead generation.
              </p> */}
            {/* </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 group-hover:border-white/20 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                        {member.image}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur opacity-50" />
              <div className="relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Ready to Transform Your Lead Generation?
                  </span>
                </h2>
                
                <p className="text-zinc-300 text-xl mb-8 max-w-2xl mx-auto">
                  Join a new generation of sales professionals who've already discovered the power of AI-driven prospecting.
                </p>
                
                <div className="space-y-6">
                  <Link href="/auth">
                    <div className="relative inline-block group cursor-pointer">
                      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse group-hover:animate-none scale-105 group-hover:scale-110" />
                      <span className="relative inline-block px-8 py-4 text-xl font-bold text-white bg-zinc-900 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-zinc-800 transition-all duration-300 hover:scale-105 shadow-2xl">
                        Start Searching →
                      </span>
                    </div>
                  </Link>
                  
                  {/* <p className="text-zinc-500 text-sm">
                    No credit card required • 14-day free trial • Cancel anytime
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </main>
  );
}