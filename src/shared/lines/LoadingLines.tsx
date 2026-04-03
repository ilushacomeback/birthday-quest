import { TypewriterLines, type TypewriterLinesProps } from './TypewriterLines';

export const LoadingLines = ({
  lines,
  onComplete,
}: Pick<TypewriterLinesProps, 'lines' | 'onComplete'>) => {
  return (
    <TypewriterLines
      key={`loading-${lines.join('|')}`}
      lines={lines}
      mode="replace"
      className="space-y-1.5 text-sm"
      getLineColorClassName={() => 'text-green-300'}
      getCursorColorClassName={() => 'bg-green-400'}
      onComplete={onComplete}
    />
  );
};
