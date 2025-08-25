import React, { useEffect } from 'react';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Smooth scroll for navigation
    const handleNavClick = (e) => {
      const target = e.target.closest('a[href^="/"]');
      if (target && !target.getAttribute('href').startsWith('/#')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        
        // Add smooth transition effect
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    };

    // Add event listeners
    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('click', handleNavClick);

    // Smooth scroll on page load
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('click', handleNavClick);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
