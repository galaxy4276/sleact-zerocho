import React, {
  FormEvent, SyntheticEvent, useCallback, useState, VFC,
} from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import {
 Link, Redirect, Route, Switch 
} from 'react-router-dom';
import apiClient from '@utils/apliClient';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { IChannel, IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import CreateWorkSpaceModal from '@components/Modal/CreateWorkspaceModal';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import CreateChannelModal from '@components/CreateChannelModal';
import { useParams } from 'react-router';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList';
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
  WorkspaceModal,
} from './styles';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

export const userDataInitialProps = {
  id: 0,
  nickname: '',
  email: '',
  Workspaces: [],
};

const WorkSpaces: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState<boolean>(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { workspace } = useParams<{ workspace: string }>();

  const {
    data: userData = userDataInitialProps,
    mutate: userUpdate,
  } = useSWR<IUser | false>('/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/workspaces/${workspace}/channels` : null, fetcher);
  const { data: memberData } = useSWR<IUser[]>(userData ? `/workspaces/${workspace}/members` : null, fetcher);

  const onLogout = useCallback(() => {
    apiClient
      .post('/users/logout')
      .then(() => userUpdate(false, false));
  }, []);

  const onClickUserProfile = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);
  const onClickCreateWorkspace = () => setShowCreateWorkspaceModal(true);

  const onCreateWorkspace = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return toast.error('워크스페이스 이름을 입력해주세요.', { position: 'top-right' });
      if (!newUrl || newUrl.trim()) return null;
      if (!newWorkspace) return null;

      return apiClient
        .post('/workspaces', {
          workspace: newWorkspace,
          url: newUrl,
        })
        .then(() => {
          userUpdate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error: AxiosError) => {
          console.dir(error);
          return toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = () => setShowWorkspaceModal((prev) => !prev);
  const onClickAddChannel = () => setShowCreateChannelModal(true);
  const onClickInviteWorkspace = () => setShowInviteWorkspaceModal(true);

  if (!userData) return <Redirect to="/login" />;

  return (
    <div>
      <Header>
        <RightMenu>
          <span aria-hidden onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
           {userData.Workspaces?.map((ws) => (
            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
           ))}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button type="button" onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button type="button" onClick={onClickAddChannel}>채널 만들기</button>
                <button type="button" onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
             <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkSpaceModal
        show={showCreateWorkspaceModal}
        newWorkspace={newWorkspace}
        newUrl={newUrl}
        onChangeNewUrl={onChangeNewUrl}
        onCloseModal={onCloseModal}
        onCreateWorkspace={onCreateWorkspace}
        onChangeNewWorkspace={onChangeNewWorkspace}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default WorkSpaces;
