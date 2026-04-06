import { QuestButton } from '../../../shared/QuestButton';
import { IoMdArrowForward } from 'react-icons/io';

type NextButtonProps = {
  handleNext: () => void;
  className?: string;
};

export const NextButton = ({ handleNext, className }: NextButtonProps) => {
  return (
    <QuestButton className={className} onClick={() => handleNext()}>
      <IoMdArrowForward size={24} />
    </QuestButton>
  );
};
