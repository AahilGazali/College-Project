import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Eye, 
  Edit3, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  Plus,
  ArrowLeft,
  Brain,
  Target,
  BarChart3
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import { useDashboard } from '../../contexts/DashboardContext';
import BookIcon from '../icons/BookIcon';

const PaperManagement = () => {
  const navigate = useNavigate();
  const { papers, getPapersByStatus } = useDashboard();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Dynamic tabs with real-time counts
  const tabs = [
    { id: 'all', title: 'All Papers', count: papers.length },
    { id: 'draft', title: 'Drafts', count: papers.filter(p => p.status === 'draft').length },
    { id: 'review', title: 'Under Review', count: papers.filter(p => p.status === 'review').length },
    { id: 'approved', title: 'Approved', count: papers.filter(p => p.status === 'approved').length }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'review':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <Edit3 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      case 'Balanced':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.modifiedAt) - new Date(a.modifiedAt);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        particleCount={60} 
        speed={0.1} 
        size={3} 
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
              <span className="text-xl font-bold text-white">Paper Management</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/generate')}
                className="bg-gradient-secondary text-white px-4 py-2 rounded-lg hover:bg-gradient-accent transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Generate New Paper
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="text-primary-200 hover:text-primary-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
                <span className="font-medium">{tab.title}</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-gradient p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers by title or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="approved">Approved</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="subject">Sort by Subject</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Papers Grid */}
        {sortedPapers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedPapers.map((paper) => (
              <div key={paper.id} className="card-gradient p-6 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {paper.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(paper.status)}`}>
                    {getStatusIcon(paper.status)}
                    {paper.status}
                  </span>
                </div>
                
                {/* Subject */}
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  {paper.subject}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{paper.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{paper.marks}</div>
                    <div className="text-xs text-gray-500">Marks</div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{paper.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(paper.difficulty)}`}>
                      {paper.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">{paper.coverage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created by:</span>
                    <span className="font-medium">{paper.createdBy}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 bg-gradient-secondary text-white px-4 py-2 rounded-lg hover:bg-gradient-accent transition-all duration-300 text-sm flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button className="flex-1 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:bg-gradient-accent transition-all duration-300 text-sm flex items-center justify-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                </div>
                
                {/* Export Button */}
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 mb-4">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </button>
                
                {/* Dates */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created: {new Date(paper.createdAt).toLocaleDateString()}</span>
                  <span>Modified: {new Date(paper.modifiedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card-gradient p-12 rounded-2xl text-center">
            <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'No papers found'
                : 'No papers yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by generating your first question paper'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary px-6 py-3"
              >
                <span>Generate Your First Paper</span>
                <ArrowLeft className="inline ml-2 h-5 w-5 rotate-180" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperManagement;
