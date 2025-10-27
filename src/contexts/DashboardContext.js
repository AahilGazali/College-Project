import React, { createContext, useContext, useState, useEffect } from 'react';
import { papersAPI, documentsAPI } from '../services/api';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalPapers: 0,
    questionsGenerated: 0,
    syllabusUploaded: 0,
    pyqsProcessed: 0
  });

  const [papers, setPapers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load papers and documents stats in parallel
      const [papersResponse, documentsResponse] = await Promise.all([
        papersAPI.getPaperStats(),
        documentsAPI.getDocumentStats()
      ]);

      // Update stats
      setStats({
        totalPapers: papersResponse.stats.totalPapers,
        questionsGenerated: papersResponse.stats.totalPapers * 10, // Estimate
        syllabusUploaded: documentsResponse.stats.syllabusCount,
        pyqsProcessed: documentsResponse.stats.pyqCount
      });

      // Load recent papers
      const papersData = await papersAPI.getPapers({ limit: 10 });
      setPapers(papersData.questionPapers);

      // Create recent activity from papers and documents
      const activities = [
        ...papersResponse.stats.recentPapers.map(paper => ({
          id: paper._id,
          description: `Generated question paper: ${paper.title}`,
          status: 'completed',
          timestamp: new Date(paper.createdAt).toLocaleDateString(),
          type: 'paper_generated'
        })),
        ...documentsResponse.stats.recentUploads.map(doc => ({
          id: doc._id,
          description: `Uploaded ${doc.type}: ${doc.title}`,
          status: 'completed',
          timestamp: new Date(doc.createdAt).toLocaleDateString(),
          type: 'document_uploaded'
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

      setRecentActivity(activities);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new paper
  const addPaper = async (paperData) => {
    try {
      const response = await papersAPI.createPaper(paperData);
      const newPaper = response.questionPaper;
      
      setPapers(prev => [newPaper, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPapers: prev.totalPapers + 1
      }));
      
      // Add to recent activity
      const activity = {
        id: newPaper._id,
        description: `Generated question paper: ${newPaper.title}`,
        status: 'completed',
        timestamp: 'Just now',
        type: 'paper_generated'
      };
      
      setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
      
      return newPaper;
    } catch (error) {
      console.error('Failed to add paper:', error);
      throw error;
    }
  };

  // Update paper status
  const updatePaperStatus = async (paperId, newStatus) => {
    try {
      await papersAPI.updatePaperStatus(paperId, newStatus);
      
      setPapers(prev => 
        prev.map(paper => 
          paper._id === paperId 
            ? { ...paper, status: newStatus, modifiedAt: new Date().toISOString() }
            : paper
        )
      );
    } catch (error) {
      console.error('Failed to update paper status:', error);
      throw error;
    }
  };

  // Add syllabus
  const addSyllabus = async (syllabusData) => {
    try {
      const formData = new FormData();
      formData.append('files', syllabusData.file);
      formData.append('title', syllabusData.title);
      formData.append('type', 'syllabus');
      formData.append('subject', syllabusData.subject);
      formData.append('subjectCode', syllabusData.subjectCode);

      const response = await documentsAPI.uploadDocuments(formData);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        syllabusUploaded: prev.syllabusUploaded + 1
      }));
      
      // Add to recent activity
      const activity = {
        id: response.documents[0]._id,
        description: `Uploaded syllabus: ${syllabusData.subject}`,
        status: 'completed',
        timestamp: 'Just now',
        type: 'syllabus_uploaded'
      };
      
      setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
      
      return response.documents[0];
    } catch (error) {
      console.error('Failed to add syllabus:', error);
      throw error;
    }
  };

  // Add PYQ
  const addPYQ = async (pyqData) => {
    try {
      const formData = new FormData();
      formData.append('files', pyqData.file);
      formData.append('title', pyqData.title);
      formData.append('type', 'pyq');
      formData.append('subject', pyqData.subject);
      formData.append('subjectCode', pyqData.subjectCode);

      const response = await documentsAPI.uploadDocuments(formData);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pyqsProcessed: prev.pyqsProcessed + 1
      }));
      
      // Add to recent activity
      const activity = {
        id: response.documents[0]._id,
        description: `Processed PYQ: ${pyqData.subject}`,
        status: 'completed',
        timestamp: 'Just now',
        type: 'pyq_processed'
      };
      
      setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
      
      return response.documents[0];
    } catch (error) {
      console.error('Failed to add PYQ:', error);
      throw error;
    }
  };

  // Get papers by status
  const getPapersByStatus = (status) => {
    if (status === 'all') return papers;
    return papers.filter(paper => paper.status === status);
  };

  // Get current projects (papers in draft or review status)
  const getCurrentProjects = () => {
    return papers
      .filter(paper => ['draft', 'review'].includes(paper.status))
      .map(paper => ({
        title: paper.title,
        description: `${paper.totalQuestions} questions, ${paper.examDuration} hours`,
        status: paper.status === 'draft' ? 'Draft' : 'Review',
        progress: paper.status === 'draft' ? 45 : 75
      }));
  };

  // Refresh dashboard data
  const refreshDashboard = () => {
    loadDashboardData();
  };

  const value = {
    stats,
    papers,
    recentActivity,
    currentProjects: getCurrentProjects(),
    loading,
    addPaper,
    updatePaperStatus,
    addSyllabus,
    addPYQ,
    getPapersByStatus,
    refreshDashboard
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
