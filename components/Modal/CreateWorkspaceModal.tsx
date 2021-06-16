import { Button, Input, Label } from '@pages/signup/styles';
import React, { FC, ChangeEvent } from 'react';
import Modal from './index';

interface Props {
  showCreateWorkspaceModal: boolean;
  onCloseModal: () => void;
  newWorkspace: string;
  onCreateWorkspace: (e: any) => void;
  newUrl: string;
  onChangeNewUrl: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeNewWorkspace: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CreateWorkspaceModal: FC<Props> = ({
  onChangeNewWorkspace,
  showCreateWorkspaceModal,
  onChangeNewUrl,
  onCloseModal,
  onCreateWorkspace,
  newUrl,
  newWorkspace,
}) => (
  <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
    <form onSubmit={onCreateWorkspace}>
      <Label id="workspace-label">
        <span>워크스페이스 이름</span>
        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
      </Label>
      <Label id="workspace-url-label">
        <span>워크스페이스 url</span>
        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
      </Label>
      <Button type="submit">생성하기</Button>
    </form>
  </Modal>
);

export default CreateWorkspaceModal;
