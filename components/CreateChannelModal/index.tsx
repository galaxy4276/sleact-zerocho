import React, { Dispatch, SetStateAction, SyntheticEvent, useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/signup/styles';
import useInput from '@hooks/useInput';
import apiClient from '@utils/apliClient';
import { useParams } from 'react-router';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const {
    data: user,
  } = useSWR<IUser | false>('/users', fetcher);
  const { revalidate: revalidateChannel } = useSWR<IChannel[]>(user ? `/workspaces/${workspace}/channels` : null, fetcher);

  const onCreateChannel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    return apiClient.post(`/workspaces/${workspace}/channels`, {
      name: newChannel,
    }).then(() => {
      setShowCreateChannelModal(false);
      revalidateChannel();
      setNewChannel('');
    }).catch((err: AxiosError) => {
      console.dir(err);
      toast.error(err.response?.data, { position: 'bottom-center' });
    });
  }, [newChannel]);

  if (!show) return null;

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
