import React, { useEffect, useState } from 'react';
import '../App.css';

const Clouds = () => {
  const [animationStage, setAnimationStage] = useState('initial');

  useEffect(() => {
    // Start the fade out animation immediately
    setAnimationStage('start-fade');
    
    // Set the final stage after the animation completes
    const completionTimer = setTimeout(() => {
      setAnimationStage('completed');
    }, 3000); // Allow enough time for the transition to complete
    
    return () => clearTimeout(completionTimer);
  }, []);

  return (
    <div className={`clouds-overlay ${animationStage !== 'initial' ? 'fade-out' : ''}`} 
         style={{ 
           visibility: animationStage === 'completed' ? 'hidden' : 'visible' 
         }}>
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>
      <div className="cloud cloud-5"></div>
      <div className="cloud cloud-6"></div>
    </div>
  );
};

export default Clouds;