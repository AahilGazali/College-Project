import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Eye,
  Clock,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const BuildPaper = () => {
  const navigate = useNavigate();
  const [paperData, setPaperData] = useState({
    title: '',
    subject: '',
    duration: 60,
    totalMarks: 100,
    instructions: '',
    sections: [
      {
        id: 1,
        name: 'Section A',
        description: 'Multiple Choice Questions',
        marks: 20,
        questions: 10,
        type: 'mcq'
      }
    ]
  });

  const [showPreview, setShowPreview] = useState(false);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${paperData.sections.length + 1}`,
      description: '',
      marks: 20,
      questions: 5,
      type: 'descriptive'
    };
    setPaperData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionId) => {
    if (paperData.sections.length > 1) {
      setPaperData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    } else {
      toast.error('At least one section is required');
    }
  };

  const updateSection = (sectionId, field, value) => {
    setPaperData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const updatePaperData = (field, value) => {
    setPaperData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalMarks = () => {
    return paperData.sections.reduce((total, section) => total + section.marks, 0);
  };

  const handleSave = async () => {
    try {
      // Here you would typically save to Firebase
      toast.success('Question paper saved successfully!');
    } catch (error) {
      toast.error('Failed to save question paper');
    }
  };

  const handleExport = () => {
    // Here you would implement PDF export functionality
    toast.success('Exporting question paper...');
  };

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice Questions' },
    { value: 'descriptive', label: 'Descriptive Questions' },
    { value: 'numerical', label: 'Numerical Questions' },
    { value: 'truefalse', label: 'True/False Questions' },
    { value: 'fillblanks', label: 'Fill in the Blanks' }
  ];

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
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Paper</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Paper Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paper Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paper Title
                    </label>
                    <input
                      type="text"
                      value={paperData.title}
                      onChange={(e) => updatePaperData('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter paper title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={paperData.subject}
                      onChange={(e) => updatePaperData('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter subject name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={paperData.duration}
                      onChange={(e) => updatePaperData('duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="30"
                      max="300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={paperData.totalMarks}
                      onChange={(e) => updatePaperData('totalMarks', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="10"
                      max="200"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={paperData.instructions}
                    onChange={(e) => updatePaperData('instructions', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter paper instructions..."
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Paper Sections</h2>
                  <button
                    onClick={addSection}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {paperData.sections.map((section) => (
                                         <div
                       key={section.id}
                       className="border-2 rounded-lg p-6 transition-all border-gray-200 hover:border-gray-300"
                     >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                            className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 w-full"
                          />
                        </div>
                        {paperData.sections.length > 1 && (
                          <button
                            onClick={() => removeSection(section.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={section.type}
                            onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {questionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Questions
                          </label>
                          <input
                            type="number"
                            value={section.questions}
                            onChange={(e) => updateSection(section.id, 'questions', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marks per Question
                          </label>
                          <input
                            type="number"
                            value={section.marks / section.questions}
                            onChange={(e) => updateSection(section.id, 'marks', parseInt(e.target.value) * section.questions)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="20"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Description
                        </label>
                        <textarea
                          value={section.description}
                          onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter section description..."
                        />
                      </div>

                      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                        <span>Total Section Marks: {section.marks}</span>
                        <span>Questions: {section.questions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Paper Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sections:</span>
                    <span className="font-semibold">{paperData.sections.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold">
                      {paperData.sections.reduce((total, section) => total + section.questions, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-semibold">{calculateTotalMarks()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{paperData.duration} min</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Section Breakdown</h4>
                  <div className="space-y-2">
                    {paperData.sections.map((section) => (
                      <div key={section.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{section.name}</span>
                        <span className="font-medium">{section.marks} marks</span>
                      </div>
                    ))}
                  </div>
                </div>

                {calculateTotalMarks() !== paperData.totalMarks && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Section marks ({calculateTotalMarks()}) don't match total marks ({paperData.totalMarks})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {paperData.title || 'Question Paper Title'}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {paperData.subject || 'Subject Name'}
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Duration: {paperData.duration} minutes
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Total Marks: {paperData.totalMarks}
                </span>
              </div>
            </div>

            {paperData.instructions && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{paperData.instructions}</p>
              </div>
            )}

            <div className="space-y-8">
              {paperData.sections.map((section, index) => (
                <div key={section.id} className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {section.name} ({section.marks} marks)
                  </h3>
                  {section.description && (
                    <p className="text-gray-600 mb-4">{section.description}</p>
                  )}
                  <div className="space-y-4">
                    {Array.from({ length: section.questions }, (_, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <span className="font-medium text-gray-900 min-w-[2rem]">
                          {i + 1}.
                        </span>
                        <div className="flex-1 min-h-[2rem] border-b border-gray-300"></div>
                        <span className="text-sm text-gray-500 min-w-[3rem]">
                          ({section.marks / section.questions} marks)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuildPaper;
