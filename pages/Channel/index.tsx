import React, { SyntheticEvent } from 'react';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { Container, Header } from './styles';

const Channel: React.FC = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    setChat('');
  };

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default Channel;
