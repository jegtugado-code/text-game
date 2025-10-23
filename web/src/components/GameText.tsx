import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useKeyPress } from '../hooks/use-key-press';

interface Props {
  text: string;
  className?: string;
  /** ms per character */
  charDelay?: number;
  /** called when streaming starts/ends */
  onStreamingChange?: (isStreaming: boolean) => void;
  /** optional callback when fully revealed */
  onComplete?: () => void;
  /** when false, show full text immediately without streaming */
  enableStreaming?: boolean;
}

export const GameText: React.FC<Props> = ({
  text,
  className,
  charDelay = 50,
  onStreamingChange,
  onComplete,
  enableStreaming = false,
}) => {
  const fullText = useMemo(() => text ?? '', [text]);
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  useKeyPress({
    key: 'Enter',
    onPress: () => {
      if (isStreaming) {
        revealAll();
      }
    },
  });

  useEffect(() => {
    // handle non-streaming mode: reveal all immediately
    if (!enableStreaming) {
      // clear any running timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      indexRef.current = fullText.length;
      setDisplayedText(fullText);
      setIsStreaming(false);
      onStreamingChange?.(false);
      onComplete?.();
      return;
    }

    // streaming mode: reset and start
    indexRef.current = 0;
    setDisplayedText('');
    setIsStreaming(true);
    onStreamingChange?.(true);

    function tick() {
      const i = indexRef.current;
      if (i >= fullText.length) {
        setIsStreaming(false);
        onStreamingChange?.(false);
        timerRef.current = null;
        onComplete?.();
        return;
      }
      setDisplayedText(prev => prev + fullText.charAt(i));
      indexRef.current = i + 1;
      timerRef.current = window.setTimeout(tick, charDelay);
    }

    timerRef.current = window.setTimeout(tick, charDelay * 2);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fullText, charDelay, onComplete, onStreamingChange, enableStreaming]);

  const revealAll = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    indexRef.current = fullText.length;
    setDisplayedText(fullText);
    setIsStreaming(false);
    onStreamingChange?.(false);
    onComplete?.();
  };

  return (
    <p
      onClick={() => {
        if (isStreaming) revealAll();
      }}
      className={className}
      aria-live="polite"
    >
      {displayedText}
      {isStreaming && <span className="animate-pulse">▌</span>}
    </p>
  );
};
