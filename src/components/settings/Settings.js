import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Manage your account information',
      icon: User,
      color: 'bg-blue-500',
      href: '/settings/profile'
    },
    {
      title: 'Notifications',
      description: 'Configure email and app notifications',
      icon: Bell,
      color: 'bg-green-500',
      href: '/settings/notifications'
    },
    {
      title: 'Security',
      description: 'Password and security settings',
      icon: Shield,
      color: 'bg-red-500',
      href: '/settings/security'
    },
    {
      title: 'Appearance',
      description: 'Customize your dashboard theme',
      icon: Palette,
      color: 'bg-purple-500',
      href: '/settings/appearance'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsSections.map((section) => (
                <div
                  key={section.title}
                  onClick={() => navigate(section.href)}
                  className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 