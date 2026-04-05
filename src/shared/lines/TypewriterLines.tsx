import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  onSound?: () => void;
  typeSoundIntervalMs?: number;
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
  typeSoundIntervalMs = 65,
  getLineColorClassName,
  getCursorColorClassName,
}: TypewriterLinesProps) => {
  const safeLines = useMemo(() => lines, [lines]);

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  const lastTypeSoundAtRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const completeCalledRef = useRef(false);

  const lineIndexRef = useRef(lineIndex);
  const charIndexRef = useRef(charIndex);
  const phaseRef = useRef(phase);

  useEffect(() => {
    lineIndexRef.current = lineIndex;
  }, [lineIndex]);

  useEffect(() => {
    charIndexRef.current = charIndex;
  }, [charIndex]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const tryPlayTypeSound = useCallback(
    (char: string) => {
      if (!onSound) return;
      if (!/\S/.test(char)) return;

      const now = performance.now();

      if (now - lastTypeSoundAtRef.current >= typeSoundIntervalMs) {
        onSound();
        lastTypeSoundAtRef.current = now;
      }
    },
    [onSound, typeSoundIntervalMs],
  );

  useEffect(() => {
    if (!safeLines.length) {
      if (!completeCalledRef.current) {
        completeCalledRef.current = true;
        onComplete?.();
      }
      return;
    }

    const tick = (time: number) => {
      if (lastFrameTimeRef.current == null) {
        lastFrameTimeRef.current = time;
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      const deltaTime = time - lastFrameTimeRef.current;
      lastFrameTimeRef.current = time;
      elapsedRef.current += deltaTime;

      const currentLineIndex = lineIndexRef.current;
      const currentPhase = phaseRef.current;

      if (currentLineIndex >= safeLines.length) {
        if (!completeCalledRef.current) {
          completeCalledRef.current = true;
          onComplete?.();
        }
        return;
      }

      if (mode === 'append') {
        while (elapsedRef.current >= speed) {
          elapsedRef.current -= speed;

          const latestLineIndex = lineIndexRef.current;
          const latestCharIndex = charIndexRef.current;
          const latestLine = safeLines[latestLineIndex] ?? '';

          if (latestLineIndex >= safeLines.length) {
            if (!completeCalledRef.current) {
              completeCalledRef.current = true;
              onComplete?.();
            }
            return;
          }

          if (latestCharIndex < latestLine.length) {
            const nextChar = latestLine[latestCharIndex] ?? '';
            tryPlayTypeSound(nextChar);
            setCharIndex((prev) => prev + 1);
          } else {
            setCompletedLines((prev) => [...prev, latestLine]);
            setLineIndex((prev) => prev + 1);
            setCharIndex(0);
          }

          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }

        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (currentPhase === 'typing') {
        while (elapsedRef.current >= speed) {
          elapsedRef.current -= speed;

          const latestLineIndex = lineIndexRef.current;
          const latestCharIndex = charIndexRef.current;
          const latestLine = safeLines[latestLineIndex] ?? '';

          if (latestLineIndex >= safeLines.length) {
            if (!completeCalledRef.current) {
              completeCalledRef.current = true;
              onComplete?.();
            }
            return;
          }

          if (latestCharIndex < latestLine.length) {
            const nextChar = latestLine[latestCharIndex] ?? '';
            tryPlayTypeSound(nextChar);
            setCharIndex((prev) => prev + 1);
          } else {
            setPhase('pause');
          }

          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }

        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (currentPhase === 'pause') {
        if (elapsedRef.current >= pauseBeforeErase) {
          elapsedRef.current -= pauseBeforeErase;
          setPhase('erasing');
          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }

        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (currentPhase === 'erasing') {
        while (elapsedRef.current >= eraseSpeed) {
          elapsedRef.current -= eraseSpeed;

          const latestCharIndex = charIndexRef.current;

          if (latestCharIndex > 0) {
            setCharIndex((prev) => prev - 1);
          } else {
            setLineIndex((prev) => prev + 1);
            setCharIndex(0);
            setPhase('typing');
          }

          rafIdRef.current = requestAnimationFrame(tick);
          return;
        }

        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = null;
      lastFrameTimeRef.current = null;
      elapsedRef.current = 0;
    };
  }, [
    safeLines,
    speed,
    eraseSpeed,
    pauseBeforeErase,
    onComplete,
    mode,
    tryPlayTypeSound,
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
                'typewriter-cursor ml-1 inline-block h-4 w-1 translate-y-0 rounded-sm align-middle',
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
