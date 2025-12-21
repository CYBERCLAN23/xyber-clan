import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation effect
 * @param {string[]} words - Array of words to cycle through
 * @param {Object} options - Animation timing options
 * @returns {string} - Currently displayed text with typing effect
 */
const useTypingAnimation = (
    words,
    {
        typingSpeed = 150,
        deletingSpeed = 100,
        pauseDuration = 2000,
        stopAtLast = true,
    } = {}
) => {
    const [displayText, setDisplayText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!words || words.length === 0) return;

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        const currentWord = words[wordIndex];
        const isLastWord = wordIndex === words.length - 1;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentWord.length) {
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                } else {
                    // Finished typing current word
                    if (isLastWord && stopAtLast) {
                        // Stop at last word
                        return;
                    }
                    setIsPaused(true);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(currentWord.slice(0, displayText.length - 1));
                } else {
                    // Finished deleting, move to next word
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, wordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseDuration, stopAtLast]);

    return displayText;
};

export default useTypingAnimation;
