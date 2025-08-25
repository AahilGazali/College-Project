import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Target, 
  CheckCircle, 
  X,
  ArrowLeft,
  Eye,
  Trash2,
  Download,
  AlertCircle,
  File,
  Brain
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import BookIcon from '../icons/BookIcon';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [uploadedFiles, setUploadedFiles] = useState({
    syllabus: [],
    pyqs: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const tabs = [
    { id: 'syllabus', title: 'Syllabus Documents', icon: BookOpen, description: 'Upload course syllabus and module information' },
    { id: 'pyqs', title: 'Previous Year Questions', icon: Target, description: 'Upload PYQ papers for reference and analysis' }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date().toISOString()
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], ...newFiles]
    }));

    // Simulate upload process
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(file => 
            file.id === fileId 
              ? { ...file, status: 'completed', progress: 100 }
              : file
          )
        }));
      } else {
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(file => 
            file.id === fileId 
              ? { ...file, progress: Math.round(progress) }
              : file
          )
        }));
      }
    }, 200);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(file => file.id !== fileId)
    }));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'txt':
        return <FileText className="h-8 w-8 text-gray-500" />;
      default:
        return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
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

        {/* Upload Area */}
        <div className="card-gradient p-8 rounded-2xl mb-8">
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-primary">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Upload {activeTab === 'syllabus' ? 'Syllabus' : 'PYQ'} Documents
            </h3>
            <p className="text-gray-600">
              Drag and drop your files here or click to browse
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary-medium bg-primary-50/50'
                : 'border-gray-300 hover:border-primary-medium hover:bg-gray-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer block"
            >
              <div className="h-16 w-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </label>
          </div>
      </div>

        {/* Uploaded Files */}
        {uploadedFiles[activeTab].length > 0 && (
          <div className="card-gradient p-6 rounded-2xl">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Uploaded {activeTab === 'syllabus' ? 'Syllabus' : 'PYQ'} Documents
            </h4>
            
            <div className="space-y-4">
              {uploadedFiles[activeTab].map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.name)}
                  <div>
                      <h5 className="font-medium text-gray-800">{file.name}</h5>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                  <div className="flex items-center space-x-4">
                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="progress-gradient h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(file.status)}`}>
                      {getStatusIcon(file.status)}
                      {file.status}
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
              </div>
            ))}
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