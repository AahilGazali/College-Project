import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Brain, 
  FileDown, 
  LogOut, 
  BookOpen,
  Settings,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    totalPapers: 24,
    questionsGenerated: 486,
    syllabusUploaded: 8,
    pyqsProcessed: 156
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const quickActions = [
    {
      title: 'Upload Syllabus',
      description: 'Add new course content',
      icon: BookOpen,
      color: 'bg-purple-500',
      href: '/upload'
    },
    {
      title: 'Generate Questions',
      description: 'Create BT level questions',
      icon: Brain,
      color: 'bg-green-500',
      href: '/generate'
    },
    {
      title: 'Build Paper',
      description: 'Create question papers',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/papers'
    },
    {
      title: 'My Papers',
      description: 'View and download',
      icon: FileDown,
      color: 'bg-orange-500',
      href: '/export'
    }
  ];

  const overviewStats = [
    {
      title: 'Total Papers',
      value: stats.totalPapers,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Questions Generated',
      value: stats.questionsGenerated,
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Syllabus Uploaded',
      value: stats.syllabusUploaded,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'PYQs Processed',
      value: stats.pyqsProcessed,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    {
      action: 'Generated question paper',
      subject: 'Data Structures',
      status: 'completed',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      action: 'Uploaded syllabus',
      subject: 'Algorithms',
      status: 'completed',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      action: 'Processing PYQs',
      subject: 'Database Systems',
      status: 'processing',
      time: '2 days ago',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const currentProjects = [
    {
      title: 'Data Structures Final Exam',
      description: '50 questions across all BT levels',
      status: 'In Progress',
      progress: 75,
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      title: 'Algorithms Mid-term',
      description: '30 questions, mixed difficulty',
      status: 'Draft',
      progress: 25,
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      title: 'Database Systems Quiz',
      description: '20 questions, basic level',
      status: 'Ready',
      progress: 100,
      statusColor: 'bg-black text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Faculty Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {currentUser?.displayName || 'Faculty Member'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <div
                key={action.title}
                onClick={() => navigate(action.href)}
                className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-purple-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity and Current Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-600 mb-6">Your latest actions and progress</p>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}: <span className="font-semibold">{activity.subject}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Projects */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Current Projects</h3>
            <p className="text-sm text-gray-600 mb-6">Your ongoing question paper projects</p>
            <div className="space-y-4">
              {currentProjects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  {project.progress < 100 && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 