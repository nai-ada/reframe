import React, { useState, useEffect } from "react";

const TypewriterEffect = ({ text, speed = 30, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleWords, setVisibleWords] = useState([]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setVisibleWords([]);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      if (currentIndex >= text.length && !isComplete) {
        const totalWords = text.split(" ").length;
        const allIndices = Array.from({ length: totalWords }, (_, i) => i);
        setVisibleWords(allIndices);
        setIsComplete(true);
        onComplete && onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextChar = text[currentIndex];
      const newText = displayText + nextChar;
      setDisplayText(newText);

      if (currentIndex === 0) {
        setTimeout(() => {
          setVisibleWords([0]);
        }, 100);
      } else if (nextChar === " " || currentIndex === text.length - 1) {
        const words = newText.split(" ");
        const wordIndex = words.length - 1;

        setTimeout(() => {
          setVisibleWords((prev) =>
            prev.includes(wordIndex) ? prev : [...prev, wordIndex]
          );
        }, 100);
      }

      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, speed, text, isComplete, onComplete, displayText]);

  const renderWords = () => {
    if (!displayText) return null;

    const words = displayText.split(" ");

    return words.map((word, index) => (
      <React.Fragment key={`word-${index}`}>
        <span
          className="inline-block transition-opacity duration-500"
          style={{
            opacity: visibleWords.includes(index) ? 1 : 0.4,
          }}
        >
          {word}
        </span>
        {index < words.length - 1 && " "}
      </React.Fragment>
    ));
  };

  return <div>{renderWords()}</div>;
};

export default TypewriterEffect;
