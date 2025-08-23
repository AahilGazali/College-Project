import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Zap, 
  Users, 
  Download,
  Upload,
  Target,
  FileDown,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Smart Syllabus Processing",
      description: "Upload syllabus in PDF or text format. Our OCR technology extracts topics and subtopics automatically."
    },
    {
      icon: Brain,
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
      description: "Upload your syllabus and previous year questions in PDF or text format."
    },
    {
      step: "02",
      title: "AI Processing",
      description: "Our AI extracts topics, analyzes content, and maps to Bloom's Taxonomy levels."
    },
    {
      step: "03",
      title: "Generate Questions",
      description: "Select topics, difficulty levels, and generate comprehensive question sets."
    },
    {
      step: "04",
      title: "Export Paper",
      description: "Review, edit, and export your question paper as a professional PDF."
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">EduGen AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Question Paper Generation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your syllabus into comprehensive question papers using advanced AI. 
              Generate questions across all Bloom's Taxonomy levels with intelligent PYQ referencing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-lg transition-colors flex items-center justify-center"
              >
                Start Creating Questions
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-semibold text-lg transition-colors flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Educators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create comprehensive, AI-powered question papers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to create professional question papers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Question Paper Creation?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of educators who are already using AI to create better assessments
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduGen AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing education with AI-powered question generation and assessment tools.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Question Generation</li>
                <li>Syllabus Processing</li>
                <li>PYQ Integration</li>
                <li>PDF Export</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Training</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduGen AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 