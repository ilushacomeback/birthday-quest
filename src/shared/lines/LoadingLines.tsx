import { TypewriterLines, type TypewriterLinesProps } from './TypewriterLines';

export const LoadingLines = ({
  lines,
  onComplete,
  onSound,
}: Pick<TypewriterLinesProps, 'lines' | 'onComplete' | 'onSound'>) => {
  return (
    <TypewriterLines
      key={`loading-${lines.join('|')}`}
      lines={lines}
      mode="replace"
      className="space-y-1.5 text-sm"
      getLineColorClassName={() => 'text-green-300'}
      getCursorColorClassName={() => 'bg-green-400'}
      onComplete={onComplete}
      onSound={onSound}
    />
  );
};
