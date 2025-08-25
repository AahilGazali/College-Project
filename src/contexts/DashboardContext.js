import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Update stats when papers change
  useEffect(() => {
    const totalQuestions = papers.reduce((sum, paper) => sum + (paper.questions || 0), 0);
    
    setStats(prev => ({
      ...prev,
      totalPapers: papers.length,
      questionsGenerated: totalQuestions
    }));
  }, [papers]);

  // Add a new paper
  const addPaper = (paper) => {
    const newPaper = {
      ...paper,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
    
    setPapers(prev => [...prev, newPaper]);
    
    // Add to recent activity
    const activity = {
      id: Date.now(),
      description: `Generated question paper: ${paper.title}`,
      status: 'completed',
      timestamp: 'Just now',
      type: 'paper_generated'
    };
    
    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]); // Keep only last 5 activities
    
    return newPaper;
  };

  // Update paper status
  const updatePaperStatus = (paperId, newStatus) => {
    setPapers(prev => 
      prev.map(paper => 
        paper.id === paperId 
          ? { ...paper, status: newStatus, modifiedAt: new Date().toISOString() }
          : paper
      )
    );
  };

  // Add syllabus
  const addSyllabus = (syllabus) => {
    setStats(prev => ({
      ...prev,
      syllabusUploaded: prev.syllabusUploaded + 1
    }));
    
    // Add to recent activity
    const activity = {
      id: Date.now(),
      description: `Uploaded syllabus: ${syllabus.subject}`,
      status: 'completed',
      timestamp: 'Just now',
      type: 'syllabus_uploaded'
    };
    
    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
  };

  // Add PYQ
  const addPYQ = (pyq) => {
    setStats(prev => ({
      ...prev,
      pyqsProcessed: prev.pyqsProcessed + 1
    }));
    
    // Add to recent activity
    const activity = {
      id: Date.now(),
      description: `Processed PYQ: ${pyq.subject}`,
      status: 'completed',
      timestamp: 'Just now',
      type: 'pyq_processed'
    };
    
    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
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
        description: `${paper.questions} questions, ${paper.difficulty} difficulty`,
        status: paper.status === 'draft' ? 'Draft' : 'Review',
        progress: paper.status === 'draft' ? 45 : 75
      }));
  };

  const value = {
    stats,
    papers,
    recentActivity,
    currentProjects: getCurrentProjects(),
    addPaper,
    updatePaperStatus,
    addSyllabus,
    addPYQ,
    getPapersByStatus
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
