import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Redirect } from 'react-router-dom';
import apiClient from '@utils/apliClient';
import {
  Header,
  ProfileImg,
  RightMenu,
  Workspaces,
  WorkspaceWrapper,
  Channels,
  Chats,
  WorkspaceName,
  MenuScroll,
} from './styles';
import gravatar from 'gravatar';

const Index: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/users', fetcher, {
    dedupingInterval: 1000 * 5,
  });

  const onLogout = useCallback(() => {
    apiClient.post('/users/logout', null, {
      withCredentials: true,
    })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>
            Menu
          </MenuScroll>
        </Channels>
        {children}
      </WorkspaceWrapper>
    </div>
  );
};

export default Index;
