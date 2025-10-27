import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowLeft,
  Brain,
  Eye,
  Download,
  Trash2,
  FileText
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import BookIcon from '../icons/BookIcon';
import { documentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [formData, setFormData] = useState({
    driveLink: '',
    title: '',
    subject: '',
    subjectCode: '',
    tags: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const tabs = [
    { id: 'syllabus', title: 'Syllabus Documents', icon: BookOpen, description: 'Upload course syllabus and module information' },
    { id: 'pyqs', title: 'Previous Year Questions', icon: Target, description: 'Upload PYQ papers for reference and analysis' }
  ];

  // Load documents for current tab
  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const type = activeTab === 'syllabus' ? 'syllabus' : 'pyq';
      const response = await documentsAPI.getDocuments({ type, limit: 50 });
      setDocuments(response.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      toast.error('Failed to load documents');
    } finally {
      setIsLoadingDocs(false);
    }
  }, [activeTab]);

  // Load documents when tab changes
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Submit Google Drive link to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.driveLink || !formData.subject) {
      toast.error('Please provide both Drive link and subject.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        driveLink: formData.driveLink,
        title: formData.title,
        type: activeTab === 'syllabus' ? 'syllabus' : 'pyq',
        subject: formData.subject,
        subjectCode: formData.subjectCode,
        tags: formData.tags
      };

      await documentsAPI.createFromLink(payload);
      toast.success('Saved Google Drive link');
      // Reset minimal fields for next entry
      setFormData(prev => ({ ...prev, driveLink: '', title: '' }));
      // Reload documents list
      loadDocuments();
    } catch (err) {
      toast.error(err.message || 'Failed to save link');
    } finally {
      setIsSaving(false);
    }
  };

  // View document - open in new tab
  const handleView = (doc) => {
    if (doc.driveLink) {
      window.open(doc.driveLink, '_blank');
    } else {
      toast.error('No drive link available');
    }
  };

  // Download document - redirect to drive link
  const handleDownload = (doc) => {
    if (doc.driveLink) {
      // Convert view link to download link
      const downloadLink = doc.driveLink.replace('/view', '/download');
      window.open(downloadLink, '_blank');
    } else {
      toast.error('No drive link available');
    }
  };

  // Delete document
  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(docId);
      toast.success('Document deleted successfully');
      // Reload the list
      loadDocuments();
    } catch (err) {
      toast.error(err.message || 'Failed to delete document');
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
              <span className="text-xl font-bold text-white">Document Upload</span>
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
          
          <div className="text-center mt-4">
            <p className="text-gray-200">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Paste Google Drive Link Area */}
        <div className="card-gradient p-8 rounded-2xl mb-8">
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-primary">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Add {activeTab === 'syllabus' ? 'Syllabus' : 'PYQ'} Document Link
            </h3>
            <p className="text-gray-600">
              Paste a public Google Drive link to your PDF (anyone-with-link should have view access)
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Drive Link</label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium"
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., SEM VII DMMM Syllabus"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Data Mining"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code (optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., module1, module2"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-medium"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-3 rounded-lg text-white font-medium shadow-primary transition ${isSaving ? 'bg-gray-400' : 'bg-gradient-secondary hover:opacity-95'}`}
              >
                {isSaving ? 'Saving...' : 'Save Link'}
              </button>
            </div>
          </form>
      </div>

        {/* Info Card */}

        {/* Uploaded Documents List */}
        {isLoadingDocs ? (
          <div className="card-gradient p-6 rounded-2xl mt-8">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-medium mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading documents...</p>
            </div>
          </div>
        ) : documents.length > 0 ? (
          <div className="card-gradient p-6 rounded-2xl mt-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Uploaded {activeTab === 'syllabus' ? 'Syllabus' : 'PYQ'} Documents
            </h4>
            
            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc._id} 
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 truncate">
                        {doc.title || doc.fileName || 'Untitled Document'}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : ''} 
                        {doc.fileSize && doc.createdAt ? ' • ' : ''}
                        {doc.createdAt ? formatDate(doc.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center space-x-3 ml-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      completed
                    </span>
                    
                    {/* Action Buttons */}
                    <button 
                      onClick={() => handleView(doc)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View document"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download document"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate('/generate')}
                className="px-6 py-3 bg-gradient-secondary text-white rounded-lg hover:opacity-95 transition"
              >
                Next: Generate Questions
              </button>
            </div>
          </div>
        ) : (
          <div className="card-gradient p-6 rounded-2xl mt-8">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No documents uploaded yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Upload your first {activeTab === 'syllabus' ? 'syllabus' : 'PYQ'} document using the form above
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/generate')}
                  className="px-6 py-3 bg-gradient-secondary text-white rounded-lg hover:opacity-95 transition"
                >
                  Next: Generate Questions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Processing Info */}
        <div className="card-gradient p-6 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gradient-secondary rounded-lg flex items-center justify-center shadow-primary">
              <Brain className="h-6 w-6 text-white" />
              </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                AI-Powered Document Processing
              </h4>
              <p className="text-gray-600 mb-4">
                Once uploaded, our AI will automatically extract key information from your documents:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Extract topics and subtopics from syllabus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Identify question patterns and difficulty levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Map questions to Bloom's Taxonomy levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Generate intelligent question suggestions
                </li>
              </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments; 