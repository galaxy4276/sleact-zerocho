import React, { FC, SyntheticEvent } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<Props> = (({ children, show, onCloseModal }) => {
  const stopPropagation = (e: SyntheticEvent) =>  e.stopPropagation();

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div aria-hidden onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
});

export default Modal;
