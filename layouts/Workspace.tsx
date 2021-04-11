import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { apiClient } from '../client';
import { Redirect } from 'react-router-dom';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR('/users', fetcher);

  const onLogout = useCallback(() => {
    apiClient.post('/users/logout', null, {
      withCredentials: true,
    })
      .then(() => {
        revalidate();
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
