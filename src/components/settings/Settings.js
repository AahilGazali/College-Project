import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import BookIcon from '../icons/BookIcon';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || 'faculty',
    institution: 'University of Technology',
    department: 'Computer Science'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    paperApprovalAlerts: true,
    weeklyReports: false,
    darkMode: false,
    autoSave: true
  });

  const tabs = [
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'appearance', title: 'Appearance', icon: Palette }
  ];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    console.log('Saving profile:', profileData);
  };

  const handleChangePassword = () => {
    // TODO: Implement password change logic
    console.log('Changing password:', passwordData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Role</label>
                <select
                  value={profileData.role}
                  onChange={(e) => handleProfileChange('role', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                >
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Institution</label>
                <input
                  type="text"
                  value={profileData.institution}
                  onChange={(e) => handleProfileChange('institution', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                  placeholder="Enter institution name"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => handleProfileChange('department', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                  placeholder="Enter department name"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="btn-primary px-6 py-3"
              >
                <span>Save Changes</span>
                <Save className="inline ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="card-gradient p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleChangePassword}
                    className="btn-primary px-6 py-3"
                  >
                    <span>Change Password</span>
                    <Key className="inline ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="card-gradient p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                        {key === 'paperApprovalAlerts' && 'Get notified when papers are approved or rejected'}
                        {key === 'weeklyReports' && 'Receive weekly summary reports'}
                        {key === 'autoSave' && 'Automatically save your work every few minutes'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-medium rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-secondary"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Appearance Settings</h3>
            
            <div className="card-gradient p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Theme Preferences</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-800">Dark Mode</h5>
                    <p className="text-sm text-gray-600">Use dark theme for better contrast</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.darkMode}
                      onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-medium rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-secondary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        particleCount={50} 
        speed={0.1} 
        size={2} 
        opacity={0.2}
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
              <span className="text-xl font-bold text-white">Settings</span>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary-200 hover:text-primary-100 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-secondary text-white shadow-primary'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.title}</span>
              </button>
              ))}
            </div>
          </div>

        {/* Tab Content */}
        <div className="card-gradient p-8 rounded-2xl">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 