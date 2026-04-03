import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

type TypewriterMode = 'append' | 'replace';
type TypewriterPhase = 'typing' | 'pause' | 'erasing';

export type TypewriterLinesProps = {
  lines: string[];
  speed?: number;
  eraseSpeed?: number;
  pauseBeforeErase?: number;
  onComplete?: () => void;
  className?: string;
  mode?: TypewriterMode;
  showCursor?: boolean;
  onSound: () => void;
  getLineColorClassName?: (params: {
    line: string;
    lineIndex: number;
    phase: TypewriterPhase;
    isCompleted: boolean;
  }) => string | undefined;
  getCursorColorClassName?: (params: {
    line: string;
    lineIndex: number;
    phase: TypewriterPhase;
  }) => string | undefined;
};

export const TypewriterLines = ({
  lines,
  speed = 50,
  eraseSpeed = 35,
  pauseBeforeErase = 700,
  onComplete,
  className,
  mode = 'append',
  showCursor = true,
  onSound,
  getLineColorClassName,
  getCursorColorClassName,
}: TypewriterLinesProps) => {
  const safeLines = useMemo(() => lines, [lines]);

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  const lastSoundCharRef = useRef<number>(-1);

  useEffect(() => {
    if (!safeLines.length) {
      onComplete?.();
      return;
    }

    if (lineIndex >= safeLines.length) {
      onComplete?.();
      return;
    }

    const currentLine = safeLines[lineIndex] ?? '';

    if (mode === 'append') {
      const timeout = window.setTimeout(() => {
        if (charIndex < currentLine.length) {
          const nextCharIndex = charIndex + 1;
          const nextChar = currentLine[nextCharIndex - 1];

          if (
            onSound &&
            nextCharIndex !== lastSoundCharRef.current &&
            /\S/.test(nextChar)
          ) {
            onSound();
            lastSoundCharRef.current = nextCharIndex;
          }

          setCharIndex((prev) => prev + 1);
          return;
        }

        setCompletedLines((prev) => [...prev, currentLine]);
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
        lastSoundCharRef.current = -1;
      }, speed);

      return () => window.clearTimeout(timeout);
    }

    if (phase === 'typing') {
      const timeout = window.setTimeout(() => {
        if (charIndex < currentLine.length) {
          const nextCharIndex = charIndex + 1;
          const nextChar = currentLine[nextCharIndex - 1];

          if (
            onSound &&
            nextCharIndex !== lastSoundCharRef.current &&
            /\S/.test(nextChar)
          ) {
            onSound();
            lastSoundCharRef.current = nextCharIndex;
          }

          setCharIndex((prev) => prev + 1);
          return;
        }

        setPhase('pause');
      }, speed);

      return () => window.clearTimeout(timeout);
    }

    if (phase === 'pause') {
      const timeout = window.setTimeout(() => {
        setPhase('erasing');
      }, pauseBeforeErase);

      return () => window.clearTimeout(timeout);
    }

    if (phase === 'erasing') {
      const timeout = window.setTimeout(() => {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          return;
        }

        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
        setPhase('typing');
        lastSoundCharRef.current = -1;
      }, eraseSpeed);

      return () => window.clearTimeout(timeout);
    }
  }, [
    safeLines,
    lineIndex,
    charIndex,
    speed,
    eraseSpeed,
    pauseBeforeErase,
    onComplete,
    mode,
    phase,
    onSound,
  ]);

  const currentLine = safeLines[lineIndex] ?? '';
  const visibleCurrentLine = currentLine.slice(0, charIndex);

  const currentLineColorClassName =
    getLineColorClassName?.({
      line: currentLine,
      lineIndex,
      phase,
      isCompleted: false,
    }) ?? '';

  const currentCursorColorClassName =
    getCursorColorClassName?.({
      line: currentLine,
      lineIndex,
      phase,
    }) ?? currentLineColorClassName;

  const cursorBlinkDurationMs = 800;

  return (
    <div className={className}>
      {mode === 'append' &&
        completedLines.map((line, index) => {
          const completedColorClassName =
            getLineColorClassName?.({
              line,
              lineIndex: index,
              phase: 'typing',
              isCompleted: true,
            }) ?? '';

          return (
            <div
              key={`${index}-${line}`}
              className={clsx('whitespace-pre-wrap', completedColorClassName)}
            >
              {line || '\u00A0'}
            </div>
          );
        })}

      {lineIndex < safeLines.length && (
        <div className={clsx('whitespace-pre-wrap', currentLineColorClassName)}>
          {visibleCurrentLine || '\u00A0'}
          {showCursor && (
            <span
              className={clsx(
                'typewriter-cursor ml-1 inline-block h-4 w-1 translate-y-[0px] rounded-sm align-middle',
                currentCursorColorClassName,
              )}
              style={
                {
                  animationDuration: `${cursorBlinkDurationMs}ms`,
                } as React.CSSProperties
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
