import React, { FC,  CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface MenuProps {
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}

const Menu: FC<MenuProps> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  if (show === false) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div aria-hidden style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
