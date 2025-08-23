import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Plus, 
  Trash2, 
  Save,
  Download,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const QuestionGenerator = () => {
  const { currentUser } = useAuth();
  const [syllabus, setSyllabus] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paperConfig, setPaperConfig] = useState({
    subject: '',
    totalMarks: 100,
    duration: 180,
    sections: [
      { name: 'Section A', marks: 20, questions: 10, type: 'objective' },
      { name: 'Section B', marks: 30, questions: 5, type: 'short' },
      { name: 'Section C', marks: 50, questions: 3, type: 'long' }
    ]
  });

  const bloomLevels = [
    { id: 'remembering', name: 'Remembering', color: 'bg-blue-100 text-blue-800' },
    { id: 'understanding', name: 'Understanding', color: 'bg-green-100 text-green-800' },
    { id: 'applying', name: 'Applying', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'analyzing', name: 'Analyzing', color: 'bg-orange-100 text-orange-800' },
    { id: 'evaluating', name: 'Evaluating', color: 'bg-purple-100 text-purple-800' },
    { id: 'creating', name: 'Creating', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', currentUser.uid),
        where('documentType', '==', 'syllabus')
      );
      const querySnapshot = await getDocs(q);
      const syllabusData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Parse extracted text to find topics
        const topics = parseSyllabusTopics(data.extractedText);
        syllabusData.push({
          id: doc.id,
          fileName: data.fileName,
          topics: topics
        });
      });
      
      setSyllabus(syllabusData);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      toast.error('Failed to load syllabus');
    }
  };

  const parseSyllabusTopics = (text) => {
    // Simple parsing logic - can be enhanced with NLP
    const lines = text.split('\n');
    const topics = [];
    
    lines.forEach((line, index) => {
      if (line.match(/^(Unit|Chapter|Module|Topic)\s*\d+/i)) {
        topics.push({
          id: index,
          name: line.trim(),
          subtopics: []
        });
      } else if (line.match(/^[A-Z][A-Za-z\s]+:/) && topics.length > 0) {
        topics[topics.length - 1].subtopics.push(line.trim());
      }
    });
    
    return topics;
  };

  const generateQuestionsForTopic = async (topic, level, count) => {
    // Simulate AI question generation
    // In real implementation, this would call OpenAI API or similar
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      const question = {
        id: `${topic.id}_${level}_${i}`,
        text: `Sample ${level} level question for ${topic.name} (Question ${i + 1})`,
        topic: topic.name,
        level: level,
        marks: getMarksForLevel(level),
        type: getQuestionType(level),
        difficulty: getDifficultyForLevel(level)
      };
      questions.push(question);
    }
    
    return questions;
  };

  const getMarksForLevel = (level) => {
    const marksMap = {
      remembering: 1,
      understanding: 2,
      applying: 3,
      analyzing: 4,
      evaluating: 5,
      creating: 6
    };
    return marksMap[level] || 2;
  };

  const getQuestionType = (level) => {
    if (['remembering', 'understanding'].includes(level)) return 'objective';
    if (['applying', 'analyzing'].includes(level)) return 'short';
    return 'long';
  };

  const getDifficultyForLevel = (level) => {
    const difficultyMap = {
      remembering: 'Easy',
      understanding: 'Easy',
      applying: 'Medium',
      analyzing: 'Medium',
      evaluating: 'Hard',
      creating: 'Hard'
    };
    return difficultyMap[level] || 'Medium';
  };

  const handleGenerateQuestions = async () => {
    if (selectedTopics.length === 0) {
      toast.error('Please select at least one topic');
      return;
    }

    setLoading(true);
    const allQuestions = [];

    try {
      for (const topic of selectedTopics) {
        for (const level of bloomLevels) {
          const questions = await generateQuestionsForTopic(topic, level.id, 2);
          allQuestions.push(...questions);
        }
      }

      setGeneratedQuestions(allQuestions);
      toast.success('Questions generated successfully!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const saveQuestionPaper = async () => {
    try {
      const paperData = {
        userId: currentUser.uid,
        subject: paperConfig.subject,
        totalMarks: paperConfig.totalMarks,
        duration: paperConfig.duration,
        sections: paperConfig.sections,
        questions: generatedQuestions,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      await addDoc(collection(db, 'questionPapers'), paperData);
      toast.success('Question paper saved successfully!');
    } catch (error) {
      console.error('Error saving question paper:', error);
      toast.error('Failed to save question paper');
    }
  };

  const toggleTopicSelection = (topic) => {
    setSelectedTopics(prev => 
      prev.find(t => t.id === topic.id)
        ? prev.filter(t => t.id !== topic.id)
        : [...prev, topic]
    );
  };

  const removeQuestion = (questionId) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const editQuestion = (questionId, newText) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, text: newText } : q)
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Generator</h1>
        <p className="text-gray-600">
          Generate questions based on Bloom's Taxonomy levels and your uploaded syllabus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Syllabus Topics */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Syllabus Topics
            </h2>
            
            {syllabus.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No syllabus uploaded yet</p>
                <p className="text-sm text-gray-400">Upload syllabus documents first</p>
              </div>
            ) : (
              <div className="space-y-3">
                {syllabus.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{doc.fileName}</h3>
                    <div className="space-y-2">
                      {doc.topics.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => toggleTopicSelection(topic)}
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            selectedTopics.find(t => t.id === topic.id)
                              ? 'bg-indigo-100 border-indigo-300'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{topic.name}</span>
                            {selectedTopics.find(t => t.id === topic.id) && (
                              <CheckCircle className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                          {topic.subtopics.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500">
                              {topic.subtopics.slice(0, 2).join(', ')}
                              {topic.subtopics.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Generated Questions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Generated Questions
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={loading || selectedTopics.length === 0}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  Generate Questions
                </button>
                {generatedQuestions.length > 0 && (
                  <button
                    onClick={saveQuestionPaper}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Paper
                  </button>
                )}
              </div>
            </div>

            {generatedQuestions.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No questions generated yet</p>
                <p className="text-sm text-gray-400">Select topics and generate questions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bloomLevels.map((level) => {
                  const levelQuestions = generatedQuestions.filter(q => q.level === level.id);
                  if (levelQuestions.length === 0) return null;

                  return (
                    <div key={level.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                          {level.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {levelQuestions.length} questions
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {levelQuestions.map((question) => (
                          <div key={question.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                  {question.text}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Topic: {question.topic}</span>
                                  <span>Marks: {question.marks}</span>
                                  <span>Type: {question.type}</span>
                                  <span>Difficulty: {question.difficulty}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => editQuestion(question.id, prompt('Edit question:', question.text))}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => removeQuestion(question.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator; 