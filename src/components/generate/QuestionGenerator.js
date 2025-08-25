import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Upload, 
  Settings, 
  Download,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Zap,
  AlertCircle
} from 'lucide-react';
import ThreeJSBackground from '../ThreeJSBackground';
import { useDashboard } from '../../contexts/DashboardContext';
import BookIcon from '../icons/BookIcon';

const QuestionGenerator = () => {
  const navigate = useNavigate();
  const { addPaper } = useDashboard();
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    totalMarks: '',
    examDuration: '',
    courseOutcomes: [''],
    modules: [''],
    difficultyLevels: ['easy', 'medium', 'hard'],
    marksDistribution: {
      partA: { marks: '', questions: '', answerCount: '' },
      partB: { marks: '', questions: '', answerCount: '' },
      partC: { marks: '', questions: '', answerCount: '' }
    }
  });

  const [generatedPapers, setGeneratedPapers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Details', icon: FileText },
    { id: 2, title: 'Syllabus & COs', icon: BookOpen },
    { id: 3, title: 'Marks Distribution', icon: Target },
    { id: 4, title: 'Generate Papers', icon: Brain },
    { id: 5, title: 'Review & Edit', icon: Edit3 }
  ];

  // Validation rules for each step
  const validationRules = {
    1: () => {
      const newErrors = {};
      if (!formData.subjectCode.trim()) {
        newErrors.subjectCode = 'Subject code is required';
      }
      if (!formData.subjectName.trim()) {
        newErrors.subjectName = 'Subject name is required';
      }
      if (!formData.totalMarks.trim()) {
        newErrors.totalMarks = 'Total marks is required';
      } else if (isNaN(formData.totalMarks) || parseInt(formData.totalMarks) <= 0) {
        newErrors.totalMarks = 'Total marks must be a positive number';
      }
      if (!formData.examDuration.trim()) {
        newErrors.examDuration = 'Exam duration is required';
      } else if (isNaN(formData.examDuration) || parseInt(formData.examDuration) <= 0) {
        newErrors.examDuration = 'Exam duration must be a positive number';
      }
      return newErrors;
    },
    2: () => {
      const newErrors = {};
      if (formData.courseOutcomes.length === 0 || formData.courseOutcomes.every(co => !co.trim())) {
        newErrors.courseOutcomes = 'At least one course outcome is required';
      }
      if (formData.modules.length === 0 || formData.modules.every(module => !module.trim())) {
        newErrors.modules = 'At least one module is required';
      }
      if (formData.difficultyLevels.length === 0) {
        newErrors.difficultyLevels = 'At least one difficulty level must be selected';
      }
      return newErrors;
    },
    3: () => {
      const newErrors = {};
      let totalMarks = 0;
      
      Object.entries(formData.marksDistribution).forEach(([part, data]) => {
        if (!data.marks || !data.questions) {
          newErrors[part] = 'Both marks and questions are required for each part';
        } else if (isNaN(data.marks) || parseInt(data.marks) <= 0) {
          newErrors[part] = 'Marks must be a positive number';
        } else if (isNaN(data.questions) || parseInt(data.questions) <= 0) {
          newErrors[part] = 'Questions must be a positive number';
        } else {
          // Calculate marks based on answerCount if provided, otherwise use total questions
          const questionsToCount = data.answerCount && parseInt(data.answerCount) > 0 
            ? parseInt(data.answerCount) 
            : parseInt(data.questions);
          
          // Validate answerCount if provided
          if (data.answerCount && parseInt(data.answerCount) > 0) {
            if (isNaN(data.answerCount) || parseInt(data.answerCount) <= 0) {
              newErrors[part] = 'Questions to answer must be a positive number';
            } else if (parseInt(data.answerCount) > parseInt(data.questions)) {
              newErrors[part] = 'Questions to answer cannot exceed total questions';
            }
          }
          
          totalMarks += parseInt(data.marks) * questionsToCount;
        }
      });
      
      if (totalMarks !== parseInt(formData.totalMarks)) {
        newErrors.totalMarks = `Marks distribution total (${totalMarks}) must equal total marks (${formData.totalMarks})`;
      }
      
      return newErrors;
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = validationRules[stepNumber] ? validationRules[stepNumber]() : {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleMarksChange = (part, field, value) => {
    setFormData(prev => ({
      ...prev,
      marksDistribution: {
        ...prev.marksDistribution,
        [part]: {
          ...prev.marksDistribution[part],
          [field]: value
        }
      }
    }));
    
    // Clear error when user starts typing
    if (errors[part]) {
      setErrors(prev => ({
        ...prev,
        [part]: ''
      }));
    }
  };

  const generatePapers = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const papers = [
        {
          id: 1,
          title: 'Data Structures Final Exam',
          status: 'draft',
          questions: 25,
          difficulty: 'Balanced',
          coverage: '85%',
          subject: 'CS301 - Data Structures',
          marks: 100,
          duration: '3 hours',
          createdBy: 'Dr. Aahil Gazali',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          description: 'Comprehensive final examination covering arrays, linked lists, trees, graphs, and sorting algorithms.',
          modules: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Sorting & Searching'],
          courseOutcomes: ['CO1: Analyze algorithm complexity', 'CO2: Implement data structures', 'CO3: Solve problems using appropriate algorithms']
        },
        {
          id: 2,
          title: 'Database Systems Quiz',
          status: 'draft',
          questions: 15,
          difficulty: 'Easy',
          coverage: '90%',
          subject: 'CS303 - Database Systems',
          marks: 30,
          duration: '1 hour',
          createdBy: 'Dr. Aahil Gazali',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          description: 'Short quiz focusing on fundamental database concepts including ER diagrams, normalization, and SQL queries.',
          modules: ['ER Modeling', 'Normalization', 'SQL Basics', 'Transactions'],
          courseOutcomes: ['CO1: Design database schemas', 'CO2: Write SQL queries', 'CO3: Understand normalization principles']
        },
        {
          id: 3,
          title: 'Algorithms Mid-term',
          status: 'draft',
          questions: 20,
          difficulty: 'Moderate',
          coverage: '88%',
          subject: 'CS302 - Algorithms',
          marks: 50,
          duration: '2 hours',
          createdBy: 'Dr. Aahil Gazali',
        createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          description: 'Mid-term examination covering algorithm analysis, divide-and-conquer strategies, and dynamic programming.',
          modules: ['Algorithm Analysis', 'Divide & Conquer', 'Dynamic Programming', 'Greedy Algorithms'],
          courseOutcomes: ['CO1: Analyze algorithm efficiency', 'CO2: Apply problem-solving strategies', 'CO3: Implement optimization algorithms']
        }
      ];
      // Add papers to dashboard context
      papers.forEach(paper => {
        addPaper(paper);
      });
      
      setGeneratedPapers(papers);
      setIsGenerating(false);
      setActiveStep(5);
      
      // Show success message
      console.log('Papers generated successfully! Dashboard counts updated in real-time.');
    }, 3000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
  return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="form-heading text-center">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Subject Code <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subjectCode}
                  onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                    errors.subjectCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., CS301"
                />
                {errors.subjectCode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.subjectCode}
                  </p>
                )}
              </div>
              
              <div>
                <label className="form-label">
                  Subject Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => handleInputChange('subjectName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                    errors.subjectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Data Structures"
                />
                {errors.subjectName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.subjectName}
                  </p>
                            )}
                          </div>
              
              <div>
                <label className="form-label">
                  Total Marks <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                    errors.totalMarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 100"
                />
                {errors.totalMarks && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.totalMarks}
                  </p>
                )}
                            </div>
              
              <div>
                <label className="form-label">
                  Exam Duration (hours) <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  value={formData.examDuration}
                  onChange={(e) => handleInputChange('examDuration', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                    errors.examDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3"
                />
                {errors.examDuration && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.examDuration}
                  </p>
                          )}
                        </div>
            </div>
                    </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Syllabus & Course Outcomes</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Course Outcomes (COs) <span className="text-red-400">*</span>
                </label>
                {formData.courseOutcomes.map((co, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={co}
                      onChange={(e) => handleArrayChange('courseOutcomes', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                      placeholder={`CO${index + 1}: Describe the outcome...`}
                    />
                    {formData.courseOutcomes.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('courseOutcomes', index)}
                        className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                {errors.courseOutcomes && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.courseOutcomes}
                  </p>
                )}
                <button
                  onClick={() => addArrayItem('courseOutcomes')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-secondary text-white rounded-lg hover:bg-gradient-accent transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Add CO
                </button>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Modules <span className="text-red-400">*</span>
                </label>
                {formData.modules.map((module, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={module}
                      onChange={(e) => handleArrayChange('modules', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient"
                      placeholder={`Module ${index + 1}: Module name...`}
                    />
                    {formData.modules.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('modules', index)}
                        className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
            )}
          </div>
                ))}
                {errors.modules && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.modules}
                  </p>
                )}
                <button
                  onClick={() => addArrayItem('modules')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-secondary text-white rounded-lg hover:bg-gradient-accent transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Add Module
                </button>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Difficulty Levels <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.difficultyLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              difficultyLevels: [...prev.difficultyLevels, level]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              difficultyLevels: prev.difficultyLevels.filter(l => l !== level)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-primary-medium focus:ring-primary-medium"
                      />
                      <span className="text-white capitalize">{level}</span>
                    </label>
                  ))}
                </div>
                {errors.difficultyLevels && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.difficultyLevels}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="form-heading text-center">Marks Distribution</h3>
            
            <div className="space-y-6">
              {Object.entries(formData.marksDistribution).map(([part, data]) => (
                <div key={part} className="card-gradient p-6 rounded-xl">
                  <h4 className="form-subheading capitalize">
                    {part === 'partA' ? 'Part A' : part === 'partB' ? 'Part B' : 'Part C'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">
                        Marks per Question <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.marks}
                        onChange={(e) => handleMarksChange(part, 'marks', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                          errors[part] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 2"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">
                        Total Questions <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.questions}
                        onChange={(e) => handleMarksChange(part, 'questions', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                          errors[part] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 10"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">
                        Questions to Answer <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.answerCount || ''}
                        onChange={(e) => handleMarksChange(part, 'answerCount', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-primary-medium input-gradient ${
                          errors[part] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 8"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty if all questions required</p>
                    </div>
                  </div>
                  
                  {errors[part] && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors[part]}
                    </p>
                  )}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Total: {data.marks && data.questions ? data.marks * (data.answerCount || data.questions) : 0} marks
                      {data.answerCount && data.answerCount !== data.questions && (
                        <span className="text-blue-600 font-medium"> (any {data.answerCount} out of {data.questions})</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {errors.totalMarks && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {errors.totalMarks}
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Examples:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Part A:</strong> 3 questions (any 2) for 5 marks each = 10 marks total</li>
                  <li>• <strong>Part B:</strong> 2 questions for 10 marks each = 20 marks total</li>
                  <li>• <strong>Part C:</strong> Leave empty if not needed</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Generate Question Papers</h3>
            
            <div className="card-gradient p-8 rounded-xl text-center">
              <div className="h-20 w-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-primary">
                <Brain className="h-10 w-10 text-white" />
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                AI-Powered Question Generation
              </h4>
              
              <p className="text-gray-600 mb-6">
                Our AI will analyze your syllabus and generate multiple question paper drafts 
                following Bloom's Taxonomy and your specified requirements.
              </p>
              
              <button
                onClick={generatePapers}
                disabled={isGenerating}
                className="btn-primary px-8 py-4 text-lg font-semibold disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Generating Papers...</span>
              </div>
            ) : (
                  <span>Generate Papers</span>
                )}
              </button>
            </div>
          </div>
        );

      case 5:
                  return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Review & Edit Generated Papers</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {generatedPapers.map((paper) => (
                <div key={paper.id} className="card-gradient p-6 rounded-xl hover:transform hover:-translate-y-2 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{paper.title}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {paper.status}
                        </span>
                      </div>
                      
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart3 className="h-4 w-4" />
                      {paper.questions} questions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      {paper.difficulty} difficulty
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      {paper.coverage} coverage
                                </div>
                              </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-secondary text-white px-4 py-2 rounded-lg hover:bg-gradient-accent transition-all duration-300 text-sm">
                      <Eye className="h-4 w-4 inline mr-2" />
                      Preview
                    </button>
                    <button className="flex-1 bg-gradient-primary text-white px-4 py-2 rounded-lg hover:bg-gradient-accent transition-all duration-300 text-sm">
                      <Edit3 className="h-4 w-4 inline mr-2" />
                      Edit
                                </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

      default:
        return null;
    }
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      // Clear errors when going back
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeJSBackground 
        particleCount={100} 
        speed={0.2} 
        size={2} 
        opacity={0.3}
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
              <span className="text-xl font-bold text-white">Question Generator</span>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary-200 hover:text-primary-100 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  activeStep >= step.id 
                    ? 'bg-gradient-secondary border-white text-white shadow-primary' 
                    : 'bg-white/20 border-white/30 text-white/50'
                }`}>
                  {activeStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                    activeStep > step.id ? 'bg-gradient-secondary' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <h2 className="text-2xl font-bold text-white">
              {steps.find(s => s.id === activeStep)?.title}
            </h2>
          </div>
        </div>

        {/* Step Content */}
        <div className="card-gradient p-8 rounded-2xl mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={activeStep === 1}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {activeStep < 4 ? (
            <button
              onClick={nextStep}
              className="btn-primary px-6 py-3"
            >
              <span>Next</span>
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
          ) : activeStep === 4 ? (
            <button
              onClick={generatePapers}
              disabled={isGenerating}
              className="btn-primary px-6 py-3 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <span>Generate Papers</span>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator; 