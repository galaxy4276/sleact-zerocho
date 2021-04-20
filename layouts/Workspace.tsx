import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Redirect } from 'react-router-dom';
import apiClient from '@utils/apliClient';

const Workspace: FC = ({ children }) => {
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
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
