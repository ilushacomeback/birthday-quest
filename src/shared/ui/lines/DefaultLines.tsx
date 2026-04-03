import { TypewriterLines, type TypewriterLinesProps } from './TypewriterLines';

export const DefaultLines = ({
  lines,
  onComplete,
}: Pick<TypewriterLinesProps, 'lines' | 'onComplete'>) => {
  return (
    <TypewriterLines
      key={`main-${lines.join('|')}`}
      lines={lines}
      mode="append"
      className="space-y-1.5 text-[17px] leading-7 text-zinc-100"
      getCursorColorClassName={() => 'bg-zinc-400'}
      onComplete={onComplete}
    />
  );
};
