import { QuestButton } from '../../../shared/QuestButton';
import { IoMdArrowBack } from 'react-icons/io';

type BackButtonProps = {
  handleBack: () => void;
  className?: string;
};

export const BackButton = ({ handleBack, className }: BackButtonProps) => {
  return (
    <QuestButton className={className} onClick={() => handleBack()}>
      <IoMdArrowBack size={24} />
    </QuestButton>
  );
};
