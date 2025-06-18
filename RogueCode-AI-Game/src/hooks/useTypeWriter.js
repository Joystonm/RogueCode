import { useState, useEffect } from 'react';

const useTypeWriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  const skipAnimation = () => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsComplete(true);
  };

  return { displayedText, isComplete, skipAnimation };
};

export default useTypeWriter;
