import React from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import { Container, Header } from './styles';

const DirectMessage: React.FC = () => {
  const { workspace, id } = useParams<{ workspace: string, id: string }>();
  const { data: userData } = useSWR<IUser>(`workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('/users', fetcher);

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
      </Header>
       <ChatList /> 
       <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
