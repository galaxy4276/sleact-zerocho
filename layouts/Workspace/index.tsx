import React, { FormEvent, useCallback, useState, FC } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import CreateWorkSpaceModal from '@components/Modal/CreateWorkspaceModal'
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const WorkSpaces: FC = () => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState<boolean>(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const { data: user, mutate } = useSWR<IUser | false>('/users', fetcher, {
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

  const onClickUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback((e: FormEvent) => {
    e.preventDefault();
    console.log({ newWorkspace, newUrl });
    if (!newWorkspace || !newWorkspace.trim()) return toast.error('워크스페이스 이름을 입력해주세요.', { position: 'top-right' });
    if (!newUrl || newUrl.trim()) return;
    if (!newWorkspace) return;
  
    return apiClient.post(`/workspaces`, {
      workspace: newWorkspace,
      url: newUrl,
    })
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error: AxiosError) => {
        console.dir(error);
        return toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newWorkspace, newUrl]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(user.email, { s: '28px', d: 'retro' })} alt={user.nickname} />
            {showUserMenu && 
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
                  <div>
                    <span id="profile-name">{user.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {user.Workspaces.map((ws: any) => {
          return (
            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          )
        })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>
            Menu
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkSpaceModal 
        showCreateWorkspaceModal={showCreateWorkspaceModal}
        newWorkspace={newWorkspace}
        newUrl={newUrl}
        onChangeNewUrl={onChangeNewUrl}
        onCloseModal={onCloseModal}
        onCreateWorkspace={onCreateWorkspace}
        onChangeNewWorkspace={onChangeNewWorkspace}
      />
    </div>
  );
};

export default WorkSpaces;
