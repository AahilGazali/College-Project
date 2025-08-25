import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Upload, 
  User, 
  BarChart3,
  ArrowRight,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import { useDashboard } from '../../contexts/DashboardContext';
import BookIcon from '../icons/BookIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, recentActivity, currentProjects } = useDashboard();

  const quickActions = [
    {
      title: 'Upload Syllabus',
      description: 'Add new course content',
      icon: Upload,
      color: 'bg-blue-500',
      href: '/upload'
    },
    {
      title: 'Generate Questions',
      description: 'Create BT level questions',
      icon: Brain,
      color: 'bg-purple-500',
      href: '/generate'
    },
    {
      title: 'Build Paper',
      description: 'Create question papers',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/generate'
    },
    {
      title: 'My Papers',
      description: 'View and download',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/papers'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        particleCount={80} 
        speed={0.15} 
        size={2.5} 
        opacity={0.25}
        className="absolute inset-0 -z-10"
      />
      
      {/* Header */}
      <header className="nav-gradient relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-secondary rounded-lg flex items-center justify-center shadow-primary">
                <BookIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">EduGen AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="h-5 w-5" />
                <span>Dr. Aahil Gazali</span>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="text-primary-200 hover:text-primary-100 transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              className="card-gradient p-6 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(action.href)}
            >
              <div className={`h-16 w-16 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-primary`}>
                <action.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Overview Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Total Papers', 
                value: stats.totalPapers, 
                icon: FileText, 
                color: 'bg-blue-500',
                description: 'Generated question papers'
              },
              { 
                title: 'Questions Generated', 
                value: stats.questionsGenerated, 
                icon: Brain, 
                color: 'bg-purple-500',
                description: 'AI-generated questions'
              },
              { 
                title: 'Syllabus Uploaded', 
                value: stats.syllabusUploaded, 
                icon: BookOpen, 
                color: 'bg-green-500',
                description: 'Course content added'
              },
              { 
                title: 'PYQs Processed', 
                value: stats.pyqsProcessed, 
                icon: BarChart3, 
                color: 'bg-orange-500',
                description: 'Previous year questions'
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="card-gradient p-6 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-16 w-16 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-primary`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity and Current Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card-gradient p-6 rounded-2xl animate-slide-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <TrendingUp className="h-6 w-6 text-primary-medium" />
            </div>
            <p className="text-gray-600 mb-6">Your latest actions and progress</p>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity yet</p>
                <p className="text-sm text-gray-400 mt-2">Start by generating your first question paper</p>
                <button
                  onClick={() => navigate('/generate')}
                  className="mt-4 btn-primary px-6 py-2 text-sm"
                >
                  <span>Get Started</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Projects */}
          <div className="card-gradient p-6 rounded-2xl animate-slide-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Current Projects</h3>
              <Target className="h-6 w-6 text-primary-medium" />
            </div>
            <p className="text-gray-600 mb-6">Your ongoing question paper projects</p>
            
            {currentProjects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active projects yet</p>
                <p className="text-sm text-gray-400 mt-2">Begin creating your first question paper</p>
                <button
                  onClick={() => navigate('/generate')}
                  className="mt-4 btn-primary px-6 py-2 text-sm"
                >
                  <span>Create Paper</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentProjects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{project.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Progress</span>
                      <span>{project.progress}% complete</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 