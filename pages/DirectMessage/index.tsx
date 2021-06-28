import React, { SyntheticEvent } from 'react';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import apliClient from '@utils/apliClient';
import { Container, Header } from './styles';

const DirectMessage: React.FC = () => {
  const { workspace, id } = useParams<{ workspace: string, id: string }>();
  const { data: userData } = useSWR<IUser>(`workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat, revalidate } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&pages=1`,
    fetcher,
  );

  const onSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log(chat);
    if (chat.trim()) {
      apliClient.post(`/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      })
        .then(() => {
          revalidate();
          setChat('');
        })
        .catch(console.error);
    }
  };

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
      </Header>
       <ChatList /> 
       <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
