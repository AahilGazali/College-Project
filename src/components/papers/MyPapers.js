import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowLeft,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyPapers = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demonstration
  const mockPapers = [
    {
      id: 1,
      title: 'Data Structures Final Exam',
      subject: 'Computer Science',
      status: 'completed',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      totalMarks: 100,
      duration: 120,
      sections: 4,
      questions: 25
    },
    {
      id: 2,
      title: 'Algorithms Mid-term',
      subject: 'Computer Science',
      status: 'draft',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      totalMarks: 50,
      duration: 60,
      sections: 3,
      questions: 15
    },
    {
      id: 3,
      title: 'Database Systems Quiz',
      subject: 'Information Technology',
      status: 'completed',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08',
      totalMarks: 30,
      duration: 45,
      sections: 2,
      questions: 10
    },
    {
      id: 4,
      title: 'Web Development Assignment',
      subject: 'Information Technology',
      status: 'in-progress',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14',
      totalMarks: 80,
      duration: 90,
      sections: 5,
      questions: 20
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPapers(mockPapers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || paper.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      case 'in-progress':
        return 'In Progress';
      default:
        return status;
    }
  };

  const handleView = (paperId) => {
    // Navigate to view paper
    navigate(`/papers/view/${paperId}`);
  };

  const handleEdit = (paperId) => {
    // Navigate to edit paper
    navigate(`/papers/edit/${paperId}`);
  };

  const handleDownload = (paperId) => {
    // Download paper as PDF
    toast.success('Downloading paper...');
  };

  const handleDelete = (paperId) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      setPapers(papers.filter(paper => paper.id !== paperId));
      toast.success('Paper deleted successfully');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/papers')}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Paper</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Question Papers</h1>
          <p className="text-gray-600">Manage and organize your created question papers</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search papers by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Papers</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Papers Grid */}
        {filteredPapers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first question paper to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/papers')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Paper
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-gray-600">{paper.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                    {getStatusLabel(paper.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-medium">{paper.totalMarks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{paper.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-medium">{paper.sections}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{paper.questions}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created: {formatDate(paper.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated: {formatDate(paper.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(paper.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEdit(paper.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDownload(paper.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="px-3 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{papers.length}</div>
              <div className="text-sm text-gray-600">Total Papers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {papers.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {papers.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {papers.filter(p => p.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPapers;
