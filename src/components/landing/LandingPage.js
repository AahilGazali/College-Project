import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Zap, 
  Users, 
  Download,
  ArrowRight,
  Play,
  Brain
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import BookIcon from '../icons/BookIcon';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Smart Syllabus Processing",
      description: "Upload syllabus in PDF or text format. Our OCR technology extracts topics and subtopics automatically."
    },
    {
      icon: BookIcon,
      title: "Bloom's Taxonomy Integration",
      description: "Generate questions across all BT levels: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating."
    },
    {
      icon: FileText,
      title: "PYQ Reference System",
      description: "Upload previous year questions and get intelligent tagging and similar question suggestions."
    },
    {
      icon: Zap,
      title: "Auto Question Generation",
      description: "AI-powered question generation based on topics, difficulty levels, and learning objectives."
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Separate dashboards for administrators and faculty members with role-based access control."
    },
    {
      icon: Download,
      title: "Export & Print",
      description: "Generate professional PDF question papers ready for printing or digital distribution."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload Content",
      description: "Upload your syllabus and previous year questions in PDF or text format.",
      icon: BookOpen
    },
    {
      step: "02",
      title: "AI Processing",
      description: "Our AI extracts topics, analyzes content, and maps to Bloom's Taxonomy levels.",
      icon: BookIcon
    },
    {
      step: "03",
      title: "Generate Questions",
      description: "Select topics, difficulty levels, and generate comprehensive question sets.",
      icon: Zap
    },
    {
      step: "04",
      title: "Export Paper",
      description: "Review, edit, and export your question paper as a professional PDF.",
      icon: Download
    }
  ];

  const handleGetStarted = () => {
    try {
      console.log('Navigating to register page...');
      navigate('/register');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLogin = () => {
    try {
      console.log('Navigating to login page...');
      navigate('/login');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        particleCount={150} 
        speed={0.3} 
        size={3} 
        opacity={0.4}
        className="absolute inset-0 -z-10"
      />
      
      {/* Header */}
      <header className="nav-gradient relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-gradient-secondary rounded-lg flex items-center justify-center shadow-primary animate-scale-in">
                                <BookIcon className="h-6 w-6 text-white" />
                              </div>
              <span className="text-2xl font-bold text-gradient animate-fade-in">EduGen AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="nav-item text-primary-200 hover:text-primary-100 font-medium transition-all duration-300 animate-slide-right"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-gradient-accent transition-all duration-300 shadow-primary hover:shadow-primary-lg transform hover:-translate-y-1 animate-slide-right"
                style={{ animationDelay: '0.1s' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Generate AI-Powered
            <span className="block text-gradient gradient-animate">Question Papers</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Transform your teaching with intelligent question generation. Upload syllabus, 
            get AI-powered questions mapped to Bloom's Taxonomy, and create professional papers in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleGetStarted}
              className="btn-primary px-8 py-4 rounded-xl text-lg font-semibold"
            >
              <span>Start Generating Questions</span>
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
            <button
              onClick={handleLogin}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              View Demo
              <Play className="inline-block ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose EduGen AI?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with educational best practices 
              to revolutionize question paper generation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-gradient p-8 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-16 w-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-6 shadow-primary">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Better Step Separation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-secondary relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Get started in just four simple steps and create your first 
              AI-generated question paper in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Step Number with Enhanced Design */}
                <div className="relative mx-auto mb-6">
                  <div className="h-24 w-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto border-4 border-white/20 shadow-primary-lg">
                    <span className="text-3xl font-bold text-white">{step.step}</span>
                  </div>
                  {/* Icon Overlay */}
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-gradient-secondary rounded-full flex items-center justify-center shadow-primary border-2 border-white">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-200">
                  {step.description}
                </p>
                
                {/* Step Separator (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-primary transform rotate-90"></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Enhanced Step Separators for Mobile */}
          <div className="lg:hidden mt-8">
            {steps.slice(0, -1).map((_, index) => (
              <div key={index} className="step-separator mx-auto w-32"></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-soft">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-gray-200 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of educators who are already using EduGen AI to create 
            engaging, comprehensive question papers that enhance student learning.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary px-10 py-4 rounded-xl text-xl font-semibold animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="inline-block ml-3 h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-8 w-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduGen AI</span>
          </div>
          <p className="text-gray-300 mb-4">
            Empowering educators with AI-powered question generation technology.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 EduGen AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 